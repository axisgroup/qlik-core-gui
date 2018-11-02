// @flow
import React from 'react';
import { Subject } from 'rxjs';
import {
  map,
  shareReplay,
  combineLatest,
  withLatestFrom,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/Operators';
import Tile from 'arc-design/components/tile';
import CheckBox from 'arc-design/components/checkbox';
import SearchBox from 'arc-design/components/searchbox';

import { componentFromStream } from '../../utils/observable-config';
import distinctProp from '../../utils/distinctProp';
import './genericObjTable.css';

const GenericObjectTable = componentFromStream(props$ => {
  // Grab the state and handlers
  const state$ = props$.pipe(
    map(
      ({
        tableState,
        onToggleRow,
        onRowClick,
        onToggleExpandAll,
        saveSearchTerm
      }) => ({
        tableState,
        onToggleRow,
        onRowClick,
        onToggleExpandAll,
        saveSearchTerm
      })
    ),
    shareReplay(1)
  );

  // Grab the data
  const data$ = props$.pipe(
    distinctProp('data'),
    shareReplay(1)
  );

  // Grab the headers
  const headers$ = props$.pipe(
    distinctProp('headers'),
    shareReplay(1)
  );

  // Grab the qTypes
  // const qTypes$ = props$.pipe(
  //   distinctProp('qTypeList'),
  //   shareReplay(1)
  // );

  const submitSearchData = new Subject();

  submitSearchData
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      withLatestFrom(state$)
    )
    .subscribe(([searchTerm, { saveSearchTerm }]) =>
      saveSearchTerm(searchTerm)
    );

  // const searchData = searchInput => {
  //   console.log(searchInput);
  // };

  const renderExpand = (node, state) => {
    let ret = '';
    if (node.children.length > 0) {
      if (
        state.tableState.expandAll ||
        state.tableState.expandedRows.includes(node.parent.key)
      ) {
        ret += '-';
      } else {
        ret += '+';
      }
    }

    return <div className="expandSymbol">{ret}</div>;
  };

  const rowChildren = (row, state, data, headers, level = 1) => (
    <React.Fragment>
      {row.children.map((child, j) => {
        if (
          state.tableState.expandAll ||
          state.tableState.expandedRows.includes(row.parent.key)
        ) {
          return (
            /* eslint-disable react/no-array-index-key */
            <React.Fragment key={j}>
              {/* eslint-enable react/no-array-index-key */}
              <tr
                className={`body-row ${
                  state.tableState.selectedObj === child.parent.key
                    ? 'selectedRow'
                    : ''
                }`}
                /* eslint-disable react/no-array-index-key */
                key={data.length + j}
                /* eslint-enable react/no-array-index-key */
              >
                {headers.map((header, i) => (
                  <td
                    className="body-row-cell"
                    /* eslint-disable react/no-array-index-key */
                    key={data.length + row.children.length + i}
                    /* eslint-enable react/no-array-index-key */
                    title={child.parent[header.key]}
                  >
                    <div
                      onClick={() => {
                        state.onToggleRow(child.parent.key);
                        state.onRowClick(child.parent.id);
                      }}
                      onKeyDown={() => {
                        state.onToggleRow(child.parent.key);
                        state.onRowClick(child.parent.id);
                      }}
                      role="button"
                      tabIndex={0}
                      style={{ paddingLeft: `${10 * level}px` }}
                      className="expandButton"
                    >
                      {child.parent[header.key] ? (
                        child.parent[header.key]
                      ) : (
                        <React.Fragment>
                          {renderExpand(child, state)}
                          <div className="content">
                            <div className="major-name">
                              {child.parent.title}
                            </div>
                            <div className="minor-name">{child.parent.id}</div>
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
              {child.children.length < 1
                ? null
                : rowChildren(child, state, data, headers, level + 1)}
            </React.Fragment>
          );
        }
        return null;
      })}
    </React.Fragment>
  );

  return data$.pipe(
    combineLatest(headers$, state$),
    map(([[data, dataAllLength, dataFilterLength], headers, state]) => (
      <div className="genericObjTableContainer">
        <div className="header">
          {/* <div className="filterType">
          </div> */}
          <div className="searchBox">
            <SearchBox
              placeholder="search"
              onSearchInput={searchInput => submitSearchData.next(searchInput)}
            />
          </div>
          <div className="searchResults">
            {state.tableState.searchTerm === ''
              ? ''
              : `Showing ${dataFilterLength} search results`}
          </div>
        </div>
        <div className="tileWrapper">
          <Tile tileTitle="OBJECT LIST">
            <div className="checkBox">
              <CheckBox
                options={[{ label: 'Expand All', value: 'expand' }]}
                onChange={expand => {
                  // if expand all needs to be changed, change it
                  if (state.tableState.expandAll !== expand.length > 0)
                    state.onToggleExpandAll(expand.length > 0);
                }}
              />
            </div>
            <table className="genericObjTable">
              <thead>
                <tr className="header-row">
                  {headers.map(header => (
                    <th className="header-row-cell" key={header.title}>
                      {header.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="body">
                {data.map(row => (
                  <React.Fragment key={row.parent.key}>
                    <tr
                      className={`body-row ${
                        state.tableState.selectedObj === row.parent.key
                          ? 'selectedRow'
                          : ''
                      }`}
                      key={row.parent.key}
                    >
                      {headers.map((header, j) => (
                        <td
                          className="body-row-cell"
                          /* eslint-disable react/no-array-index-key */
                          key={j}
                          /* eslint-enable react/no-array-index-key */
                          title={row[header.key]}
                        >
                          <div
                            onClick={() => {
                              state.onToggleRow(row.parent.id);
                              state.onRowClick(row.parent.id);
                            }}
                            onKeyDown={() => {
                              state.onToggleRow(row.parent.id);
                              state.onRowClick(row.parent.id);
                            }}
                            role="button"
                            tabIndex={0}
                            className="expandButton"
                          >
                            {row.parent[header.key] ? (
                              row.parent[header.key]
                            ) : (
                              <React.Fragment>
                                {renderExpand(row, state)}
                                <div className="content">
                                  <div className="major-name">
                                    {row.parent.title}
                                  </div>
                                  <div className="minor-name">
                                    {row.parent.id}
                                  </div>
                                </div>
                              </React.Fragment>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                    {rowChildren(row, state, data, headers)}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <div className="footer">Total {dataAllLength} objects</div>
          </Tile>
        </div>
      </div>
    ))
  );
});

export default GenericObjectTable;
