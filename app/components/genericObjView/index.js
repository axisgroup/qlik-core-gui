// @flow
import React from 'react';
import { withHandlers, compose } from 'recompose';
import { connect } from 'react-redux';
import {
  switchMap,
  map,
  startWith,
  switchAll,
  shareReplay,
  switchMapTo,
  take,
  withLatestFrom,
  combineLatest,
  partition
} from 'rxjs/Operators';
import { merge } from 'rxjs';
import {
  GetAllInfos,
  CreateSessionObject,
  GetObjects,
  GetObject
} from 'rxq/Doc';
import { GetLayout, GetFullPropertyTree } from 'rxq/GenericObject';
import {
  toggleRow,
  selectObj,
  toggleExpandAll
} from '../../actions/genericTable';

import { componentFromStream } from '../../utils/observable-config';
import distinctProp from '../../utils/distinctProp';
import GenericObjectTable from '../genericObjTable';
import GenericObjectDetail from '../genericObjDetail';
import './genericObjView.css';

// the sheet objects list from qlik needs a property tree
const AppObjectList = {
  qInfo: {
    qId: '',
    qType: 'SessionLists'
  },
  qAppObjectListDef: {
    qType: 'sheet',
    qData: {
      cells: '/cells',
      rank: '/rank',
      columns: '/columns',
      rows: '/rows'
    }
  }
};

// the Generic Objects table needs headers
const headerKeys = [
  { key: 'title', title: 'Name' },
  { key: 'type', title: 'Type' },
  { key: 'id', title: 'qId' }
];

// State Management
const mapStateToProps = state => ({
  genericTable: state.genericTable
});

const tableHandlers = withHandlers({
  dispatchToggleRow: ({ dispatch }) => (rowName: string) => {
    dispatch(toggleRow(rowName));
  },
  dispatchSelectObj: ({ dispatch }) => (obj: string) => {
    dispatch(selectObj(obj));
  },
  dispatchToggleExpandAll: ({ dispatch }) => () => {
    dispatch(toggleExpandAll());
  }
});
// END State Management

// The main function
const GenericObjectView = props$ => {
  // Get the doc handle
  const doc$ = props$.pipe(
    distinctProp('doc$'),
    switchAll(),
    shareReplay(1)
  );

  // Get the currentQID
  const qId$ = props$.pipe(
    distinctProp('genericTable', 'selectedObj'),
    shareReplay(1)
  );

  // Get the state and the handlers
  const state$ = props$.pipe(
    // map(props => ({
    //   genericTable: props.genericTable,
    //   dispatchToggleRow: props.dispatchToggleRow,
    //   dispatchSelectObj: props.dispatchSelectObj,
    //   dispatchToggleExpandAll: props.dispatchToggleExpandAll
    // })),
    shareReplay(1)
  );

  // Partition based on qId state
  const [withQID$, noQID$] = doc$.pipe(
    combineLatest(qId$),
    partition(([qId]) => qId.length > 0)
  );

  // Get object based on qId
  const selObj$ = withQID$.pipe(
    switchMap(([docH, qId]) => docH.ask(GetObject, qId)),
    switchMap(objH => objH.invalidated$.pipe(startWith(objH))),
    shareReplay(1)
  );

  // Gets object properties and terminates if no qID
  const selObjProps$ = merge(
    noQID$,
    selObj$.pipe(switchMap(objH => objH.ask(GetFullPropertyTree)))
  );

  // Gets object layout
  const selObjLayout$ = merge(
    noQID$,
    selObj$.pipe(switchMap(objH => objH.ask(GetLayout)))
  );

  // Creates a session object that will display all the types of objects in the app currently in a heirarchy form
  const AppList$ = doc$.pipe(
    switchMap(docH => docH.ask(CreateSessionObject, AppObjectList)),
    switchMap(objH => objH.invalidated$.pipe(startWith(objH))),
    shareReplay(1)
  );

  // This will get a list of all the qTypes currently in the app
  const getAllQTypes$ = doc$.pipe(
    switchMap(docH => docH.ask(GetAllInfos)),
    map(objList =>
      objList
        .map(obj => obj.qType)
        .filter((value, index, self) => self.indexOf(value) === index)
    ),
    take(1)
  );

  // This will use the list of all the qTypes currently in the app to pull the object info
  const getAllObjects = (objList: string[]) =>
    doc$.pipe(
      switchMap(docH =>
        docH.ask(GetObjects, {
          qTypes: objList,
          qData: {
            title: '/title'
          }
        })
      ),
      take(1)
    );

  // Start with a generic object of app objects that invalidates => get all the types that exist => get all objects of those types
  // ==> match with the layout of the app objects to get the full heirarchy with all info
  // ==> bring in the state & actions to feed into presentation components
  return AppList$.pipe(
    switchMapTo(getAllQTypes$),
    switchMap((objList: string[]) => getAllObjects(objList)),
    withLatestFrom(AppList$.pipe(switchMap(objH => objH.ask(GetLayout)))),
    map(([objList, heirarchy]) =>
      // map the two data sources into a single heirarchial structure
      // the heirarchy needs to get the object title from object list
      heirarchy.qAppObjectList.qItems.map(sheet => {
        // match each child in the heirarchy to its twin in the object list, to get the object title
        const children = sheet.qData.cells.map(child => {
          const childInfo = objList.find(val => val.qInfo.qId === child.name);
          return {
            title: childInfo.qData.title,
            id: child.name,
            type: child.type
          };
        });
        // return the sheet name & id along with the child info that's been supplemented by object list
        return {
          title: sheet.qMeta.title,
          type: 'sheet',
          id: sheet.qInfo.qId,
          children
        };
      })
    ),
    combineLatest(state$, selObjProps$, selObjLayout$),
    map(([result, stateObj, objProps, objLayout]) => (
      <div className="genericObjView">
        <div className="genericObjTable">
          <GenericObjectTable
            data={result}
            headers={headerKeys}
            tableState={stateObj.genericTable}
            onToggleRow={stateObj.dispatchToggleRow}
            onRowClick={stateObj.dispatchSelectObj}
            onToggleExpandAll={stateObj.dispatchToggleExpandAll}
          />
        </div>
        <div className="genericObjDetail">
          <GenericObjectDetail objProps={objProps} objLayout={objLayout} />
        </div>
      </div>
    ))
  );
};

export default compose(
  connect(mapStateToProps),
  tableHandlers
)(componentFromStream(GenericObjectView));
