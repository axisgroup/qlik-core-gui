// @flow
import React from 'react';
import { map, tap } from 'rxjs/Operators';
import ReactJson from 'react-json-view';
import { withHandlers, compose } from 'recompose';
import { connect } from 'react-redux';
import Button from 'arc-design/components/button';
import { componentFromStream } from '../../../utils/observable-config';
import { saveProps } from '../../../actions/genericObjectDetails';
import './genericObjPropEditor.css';

// State Management
const mapStateToProps = state => ({
  genericTable: state.genericTable,
  genericObjectDetails: state.genericObjectDetails
});

const detailHandlers = withHandlers({
  dispatchSaveProps: ({ dispatch }) => (props: {}) => {
    dispatch(saveProps(props));
  }
});

const GenericObjectPropEditor = props$ => {
  // function that handles the changing of the source JSON
  const changeSource = (obj, dispatchSaveProps) => {
    dispatchSaveProps(obj.updated_src);
    return true;
  };

  const saveObj = newProps => {
    console.log(newProps);
  };

  // function that returns the display of the object layout
  const displayObjLayout = (
    objProperties,
    dispatchSaveProps,
    genericObjectDetails
  ) => (
    <div className="objPropEditor">
      <div className="detailHeader">
        <Button onClick={() => saveObj(genericObjectDetails.currProps)}>
          Save
        </Button>
      </div>
      <div className="jsonEditor">
        <ReactJson
          src={objProperties}
          name={null}
          onEdit={resp => changeSource(resp, dispatchSaveProps)}
          onAdd={resp => changeSource(resp, dispatchSaveProps)}
          onDelete={resp => changeSource(resp, dispatchSaveProps)}
        />
        <div />
      </div>
    </div>
  );

  return props$.pipe(
    tap(console.log),
    map(({ objProps, dispatchSaveProps, genericObjectDetails }) => {
      const content = objProps
        ? displayObjLayout(objProps, dispatchSaveProps, genericObjectDetails)
        : 'No Object Selected';
      return <div className="genericObjProperties">{content}</div>;
    })
  );
};

export default compose(
  connect(mapStateToProps),
  detailHandlers
)(componentFromStream(GenericObjectPropEditor));
// export default GenericObjectPropEditor;
