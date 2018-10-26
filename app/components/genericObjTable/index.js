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

  const toggleCell = (state, child, headers) =>
    state.tableState.expandAll ||
    state.tableState.expandedRows.includes(child.parent[headers[2].key]) ? (
      <td className="body-row-cell toggle">
        <div
          onClick={() => state.onToggleRow(child.parent[headers[2].key])}
          onKeyDown={() => state.onToggleRow(child.parent[headers[2].key])}
          role="button"
          tabIndex={0}
          className="toggleButton"
        >
          <span> - </span>
        </div>
      </td>
    ) : (
      <td className="body-row-cell toggle">
        <div
          onClick={() => state.onToggleRow(child.parent[headers[2].key])}
          onKeyDown={() => state.onToggleRow(child.parent[headers[2].key])}
          role="button"
          tabIndex={0}
          className="toggleButton"
        >
          <span>+</span>
        </div>
      </td>
    );

  const rowChildren = (row, state, data, headers) => (
    <React.Fragment>
      {row.children.map((child, j) => {
        if (
          state.tableState.expandAll ||
          state.tableState.expandedRows.includes(row.parent[headers[2].key])
        ) {
          return (
            /* eslint-disable react/no-array-index-key */
            <React.Fragment key={j}>
              {/* eslint-enable react/no-array-index-key */}
              <tr
                className="body-row second-level"
                /* eslint-disable react/no-array-index-key */
                key={data.length + j}
                /* eslint-enable react/no-array-index-key */
              >
                {child.children.length < 1 ? (
                  <td>&nbsp;</td>
                ) : (
                  toggleCell(state, child, headers)
                )}
                {headers.map(header => (
                  <td
                    className="body-row-cell"
                    /* eslint-disable react/no-array-index-key */
                    key={child.parent[header.key]}
                    /* eslint-enable react/no-array-index-key */
                    title={child.parent[header.key]}
                  >
                    <div
                      onClick={() => state.onRowClick(child.parent.id)}
                      onKeyDown={() => state.onRowClick(child.parent.id)}
                      role="button"
                      tabIndex={0}
                    >
                      {child.parent[header.key]}
                    </div>
                  </td>
                ))}
              </tr>
              {child.children.length < 1
                ? null
                : rowChildren(child, state, data, headers)}
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
                  <td>&nbsp;</td>
                  {headers.map(header => (
                    <td className="header-row-cell" key={header.title}>
                      {header.title}
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody className="body">
                {data.map(row => (
                  <React.Fragment key={row.parent[headers[2].key]}>
                    <tr
                      className="body-row top-level"
                      key={row.parent[headers[0].key]}
                    >
                      {toggleCell(state, row, headers)}
                      {headers.map((header, j) => (
                        <td
                          className="body-row-cell"
                          /* eslint-disable react/no-array-index-key */
                          key={j}
                          /* eslint-enable react/no-array-index-key */
                          title={row[header.key]}
                        >
                          <div
                            onClick={() => state.onRowClick(row.parent.id)}
                            onKeyDown={() => state.onRowClick(row.parent.id)}
                            role="button"
                            tabIndex={0}
                          >
                            {row.parent[header.key]}
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
