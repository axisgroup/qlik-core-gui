/* eslint-disable import/extensions */
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
  partition,
  mapTo,
  debounceTime
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
import Fuse from 'fuse.js';

import {
  toggleRow,
  selectObj,
  toggleExpandAll,
  saveSearchTerm,
  updateQTypes
} from '../../actions/genericTable';
import { setTab } from '../../actions/genericObjectDetails';
import { componentFromStream } from '../../utils/observable-config';
import distinctProp from '../../utils/distinctProp';
import GenericObjectTable from '../genericObjTable';
import GenericObjectDetail from '../genericObjDetail';
import './genericObjView.css';

// the Generic Objects table needs headers
const headerKeys = [
  { key: 'name', title: 'Name/qID' },
  { key: 'type', title: 'qType' }
];

// State Management
const mapStateToProps = state => ({
  genericTable: state.genericTable,
  genericObjectDetails: state.genericObjectDetails
});

const tableHandlers = withHandlers({
  dispatchToggleRow: ({ dispatch }) => (rowName: string) => {
    dispatch(toggleRow(rowName));
  },
  dispatchSelectObj: ({ dispatch }) => (obj: string) => {
    dispatch(selectObj(obj));
  },
  dispatchToggleExpandAll: ({ dispatch }) => (expand: boolean) => {
    dispatch(toggleExpandAll(expand));
  },
  dispatchSaveSearchTerm: ({ dispatch }) => (searchTerm: string) => {
    dispatch(saveSearchTerm(searchTerm));
  },
  dispatchUpdateQtypes: ({ dispatch }) => (qTypeSelections: string[]) => {
    dispatch(updateQTypes(qTypeSelections));
  }
});

const detailHandlers = withHandlers({
  dispatchSetTab: ({ dispatch }) => (newTab: string) => {
    dispatch(setTab(newTab));
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

  // combine doc handle and qId handle
  const docQID$ = doc$.pipe(
    combineLatest(qId$),
    shareReplay(1)
  );

  // Get the state and the handlers
  const state$ = props$.pipe(shareReplay(1));

  // Get the search term
  const searchTerm$ = props$.pipe(
    distinctProp('genericTable', 'searchTerm'),
    shareReplay(1)
  );

  // Get the qType filter list
  const qTypeFilter$ = props$.pipe(
    distinctProp('genericTable', 'qTypeSelections'),
    shareReplay(1)
  );

  // Partition based on qId state
  const [withQID$, noQID$] = docQID$.pipe(
    partition(array => array[1].length > 0)
  );

  // Get object based on qId
  const selObj$ = withQID$.pipe(
    switchMap(([docH, qId]) => docH.ask(GetObject, qId)),
    switchMap(objH => objH.invalidated$.pipe(startWith(objH))),
    shareReplay(1)
  );

  // Gets object properties and maps to null if no qID
  const selObjProps$ = merge(
    noQID$.pipe(mapTo(null)),
    selObj$.pipe(switchMap(objH => objH.ask(GetFullPropertyTree)))
  );

  // Gets object layout and maps to null if no qID
  const selObjLayout$ = merge(
    noQID$.pipe(mapTo(null)),
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
                type: obj.qInfo.qType,
                key: obj.qInfo.qId
              };
              return { children: objChilds, parent };
            }),
            take(1)
          )
        );
        return zip(...objChildInfo);
      }),
      take(1)
    );

  // Start with a generic object of app objects that invalidates
  // ==> get all the types that exist
  // ==> get all objects of those types along with their children
  // ==> build the heirarchy
  // ==> bring in the state & actions to feed into presentation components
  return AppList$.pipe(
    switchMapTo(getAllQTypes$),
    switchMap((objTypeList: string[]) => getAllObjects(objTypeList)),
    combineLatest(qTypeFilter$),
    map(([objParents, qTypeFilters]) => {
      let objParentsCopy = JSON.parse(JSON.stringify(objParents));
      if (qTypeFilters.length > 0) {
        objParentsCopy = objParents.filter(obj =>
          qTypeFilters.includes(obj.parent.type)
        );
      }
      // fuse search set up
      const options = {
        threshold: 0,
        keys: ['parent.title', 'parent.id', 'parent.type']
      };
      const copyObject = objParentsCopy;
      const fuse = new Fuse(copyObject, options);
      return [objParentsCopy, fuse, objParents.length];
    }),
    combineLatest(searchTerm$),
    map(([[objParentsOrig, fuse, dataAllLength], searchTerm]) => {
      let objParents;
      if (searchTerm !== '') {
        const searchRes = fuse.search(searchTerm);
        objParents = JSON.parse(JSON.stringify(searchRes));
      } else {
        objParents = JSON.parse(JSON.stringify(objParentsOrig));
      }
      const dataFilterLength = objParents.length;
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
          const childArray = [];
          for (let i = 0; i < parent.children.length; i += 1) {
            const foundChild = objParents.filter(
              obj => obj.parent.id === parent.children[i].qId
            );
            if (foundChild.length > 0) {
              childArray.push(foundChild[0]);
              findChildren(foundChild[0]);
            }
          }
          /* eslint-disable no-param-reassign */
          parent.children = childArray;
          /* eslint-enable no-param-reassign */
        }
      };
      for (let i = 0; i < lvl1Parents.length; i += 1) {
        findChildren(lvl1Parents[i]);
      }
      return [lvl1Parents, dataAllLength, dataFilterLength];
    }),
    combineLatest(state$, selObjProps$, selObjLayout$, getAllQTypes$),
    debounceTime(100),
    map(([result, stateObj, objProps, objLayout, qTypeList]) => (
      // map(([[result, stateObj], objProps, objLayout, qTypeList]) => (
      <div className="genericObjView">
        <div className="genericObjTable">
          <GenericObjectTable
            data={result}
            qTypeList={qTypeList}
            headers={headerKeys}
            tableState={stateObj.genericTable}
            onToggleRow={stateObj.dispatchToggleRow}
            onRowClick={stateObj.dispatchSelectObj}
            onToggleExpandAll={stateObj.dispatchToggleExpandAll}
            saveSearchTerm={stateObj.dispatchSaveSearchTerm}
            updateQTypes={stateObj.dispatchUpdateQtypes}
          />
        </div>
        <div className="genericObjDetail">
          <GenericObjectDetail
            objProps={objProps}
            objLayout={objLayout}
            detailState={stateObj.genericObjectDetails}
            onSetTab={stateObj.dispatchSetTab}
          />
        </div>
      </div>
    ))
  );
};

export default compose(
  connect(mapStateToProps),
  tableHandlers,
  detailHandlers
)(componentFromStream(GenericObjectView));
