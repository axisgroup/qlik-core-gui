// @flow
import React from 'react';
import { map, shareReplay, combineLatest } from 'rxjs/Operators';
import Tile from 'arc-design/components/tile';
import Button from 'arc-design/components/Button';

import { componentFromStream } from '../../utils/observable-config';
import distinctProp from '../../utils/distinctProp';
import './genericObjTable.css';

const GenericObjectTable = componentFromStream(props$ => {
  // Grab the state and handlers
  const state$ = props$.pipe(
    map(({ tableState, onToggleRow, onRowClick, onToggleExpandAll }) => ({
      tableState,
      onToggleRow,
      onRowClick,
      onToggleExpandAll
    })),
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
    map(([data, headers, state]) => (
      <div className="genericObjTableContainer">
        <div className="header">
          <Button onClick={() => state.onToggleExpandAll()}>
            {state.tableState.expandAll ? 'Collapse All' : 'Expand All'}
          </Button>
        </div>
        <div className="tileWrapper">
          <Tile>
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
          </Tile>
        </div>
      </div>
    ))
  );
});

export default GenericObjectTable;
