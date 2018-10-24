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
  mergeMap,
  combineLatest,
  partition
} from 'rxjs/Operators';
import { merge, zip } from 'Rxjs';
import {
  GetAllInfos,
  CreateSessionObject,
  GetObjects,
  GetObject
} from 'rxq/Doc';
import {
  GetLayout,
  GetFullPropertyTree,
  GetChildInfos
} from 'rxq/GenericObject';
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
  const state$ = props$.pipe(shareReplay(1));

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
  const AppList = objType => {
    // the objects list from qlik needs a property tree
    const AppObjectList = {
      qInfo: {
        qId: '',
        qType: 'SessionLists'
      },
      qAppObjectListDef: {
        qType: objType,
        qData: {
          cells: '/cells',
          rank: '/rank',
          columns: '/columns',
          rows: '/rows'
        }
      }
    };

    return doc$.pipe(
      switchMap(docH => docH.ask(CreateSessionObject, AppObjectList)),
      switchMap(objH => objH.invalidated$.pipe(startWith(objH))),
      shareReplay(1)
    );
  };

  const AppList$ = AppList('sheet');

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
  const getAllObjects = (objTypeList: string[]) =>
    doc$.pipe(
      switchMap(docH =>
        docH.ask(GetObjects, {
          qTypes: objTypeList,
          qData: {
            title: '/title'
          }
        })
      ),
      mergeMap(objList => {
        const objChildInfo = objList.map(obj =>
          doc$.pipe(
            switchMap(docH => docH.ask(GetObject, obj.qInfo.qId)),
            switchMap(objH => objH.ask(GetChildInfos)),
            map(objChilds => {
              const parent = {
                title:
                  obj.qInfo.qType === 'sheet'
                    ? obj.qMeta.title
                    : obj.qData.title,
                id: obj.qInfo.qId,
                type: obj.qInfo.qType
              };
              return { children: objChilds, parent };
            }),
            take(1)
          )
        );
        return zip(...objChildInfo);
        // .pipe(map(objs => objs.filter(obj => obj)))
      }),
      take(1)
    );

  // Start with a generic object of app objects that invalidates => get all the types that exist => get all objects of those types
  // ==> match with the layout of the app objects to get the full heirarchy with all info
  // ==> bring in the state & actions to feed into presentation components
  return AppList$.pipe(
    switchMapTo(getAllQTypes$),
    switchMap((objTypeList: string[]) => getAllObjects(objTypeList)),
    map(objParents => {
      // map the data sources into a heirarchial structure
      // Step 1 - get all the objects that are children
      const childrenObjs = objParents
        .map(obj => obj.children)
        .reduce((acc, curr) => acc.concat(curr), []);
      const childrenIDs = childrenObjs.map(child => child.qId);
      // Step 2 - get all the level 1 parents (are not children of any other objects)
      const lvl1Parents = objParents.filter(
        obj => !childrenIDs.includes(obj.parent.id)
      );
      // Step 3 - assign all children to their parents
      const findChildren = parent => {
        if (parent.children.length > 0) {
          for (let i = 0; i < parent.children.length; i += 1) {
            const foundChild = objParents.filter(
              obj => obj.parent.id === parent.children[i].qId
            );
            /* eslint-disable no-param-reassign */
            parent.children[i] = foundChild[0];
            /* eslint-enable no-param-reassign */
            findChildren(parent.children[i]);
          }
        }
      };
      for (let i = 0; i < lvl1Parents.length; i += 1) {
        findChildren(lvl1Parents[i]);
      }
      console.log('lvl1parents', lvl1Parents);
      return lvl1Parents;
    }),
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
