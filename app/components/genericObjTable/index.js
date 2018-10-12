// @flow
import React from 'react';
import { componentFromStream } from '../../../app/utils/observable-config';
import distinctProp from '../../../app/utils/distinctProp';
import {
  switchMap,
  map,
  tap,
  mergeMap,
  startWith,
  switchAll,
  shareReplay,
  switchMapTo,
  take,
  combineLatest
} from 'rxjs/Operators';
import { GetAllInfos, CreateSessionObject, GetObjects } from 'rxq/Doc';
import { GetLayout } from 'rxq/GenericObject';

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

  return data$.pipe(
    combineLatest(headers$, state$),
    map(([data, headers, state]) => {
      console.log(data);
      return (
        <React.Fragment>
          <button onClick={() => state.onToggleExpandAll()}>
            {state.tableState.expandAll ? 'Collapse All' : 'Expand All'}
          </button>
          <table className="genericObjTable">
            <thead>
              <tr className="header-row">
                <td>&nbsp;</td>
                {headers.map((header, i) => (
                  <td className="header-row-cell" key={i}>
                    {header.title}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody className="body">
              {data.map((row, i) => (
                <React.Fragment key={i}>
                  <tr className="body-row top-level" key={i}>
                    {state.tableState.expandAll ||
                    state.tableState.expandedRows.includes(
                      row[headers[0].key]
                    ) ? (
                      <td
                        className="body-row-cell toggle"
                        onClick={() => state.onToggleRow(row[headers[0].key])}
                      >
                        -
                      </td>
                    ) : (
                      <td
                        className="body-row-cell toggle"
                        onClick={() => state.onToggleRow(row[headers[0].key])}
                      >
                        +
                      </td>
                    )}
                    {headers.map((header, j) => (
                      <td
                        onClick={() => state.onRowClick(row.id)}
                        className="body-row-cell"
                        key={j}
                        title={row[header.key]}
                      >
                        {row[header.key]}
                      </td>
                    ))}
                  </tr>
                  {row.children.map((child, j) => {
                    if (
                      state.tableState.expandAll ||
                      state.tableState.expandedRows.includes(
                        row[headers[0].key]
                      )
                    ) {
                      return (
                        <tr
                          className="body-row second-level"
                          key={data.length + j}
                        >
                          <td>&nbsp;</td>
                          {headers.map((header, k) => (
                            <td
                              className="body-row-cell"
                              key={k}
                              title={child[header.key]}
                            >
                              {child[header.key]}
                            </td>
                          ))}
                        </tr>
                      );
                    } else {
                      return null;
                    }
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </React.Fragment>
      );
    })
  );
});

export default GenericObjectTable;
