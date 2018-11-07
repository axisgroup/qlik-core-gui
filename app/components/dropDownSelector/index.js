import React, { Component } from 'react';
import Downshift from 'downshift';
import classNames from 'classname';
import Tag from 'arc-design/components/tag';
import List from 'arc-design/components/list';
import './dropDownSelector.css';

class Dropdown extends Component {
  constructor(props) {
    super(props);

    // default selection into state?
    this.state = {
      selectedItems: this.props.defaultSelection,
      isOpen: false
    };
  }

  handleChange(item) {
    let newSelectedItems;
    if (this.props.multiselect) {
      const currSelectedItems = this.state.selectedItems;
      if (currSelectedItems.includes(item.id)) {
        newSelectedItems = currSelectedItems.filter(
          selected => selected !== item.id
        );
      } else {
        newSelectedItems = [...currSelectedItems, item.id];
      }
      item.selected = !item.selected
    } else {
      newSelectedItems = [item.id];
      item.selected = true;
    }
    this.setState({
      selectedItems: newSelectedItems
    }, () => this.props.onChange(item, this.state.selectedItems));
  }

  toggleDropdown() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  removeSelection(evt, id) {
    evt.stopPropagation();
    this.setState({
      selectedItems: this.state.selectedItems.filter(itemId => itemId !== id)
    }, () => this.props.onChange(null, this.state.selectedItems));
  }

  removeAllSelections(evt) {
    evt.stopPropagation();
    this.setState({
      selectedItems: []
    }, () => this.props.onChange(null, this.state.selectedItems));
  }

  render() {
    const { title, layout, items, maxTagCount = 1, iconIndicator, defaultText } = this.props;
    const { selectedItems, isOpen } = this.state;

    const containerClass = classNames('arc-dropdown', {
      horizontal: layout === 'horizontal'
    });

    const selectedCount = selectedItems.length;
    const itemsCount = items.length;

    const listItems = items.map(item => ({
      ...item,
      selected: selectedItems.includes(item.id)
    }));

    return (
      <Downshift
        selectedItem={selectedItems}
        onChange={this.handleChange.bind(this)}
        isOpen={this.state.isOpen}
        onOuterClick={() => {
          this.setState({
            isOpen: false
          });
        }}
      >
        {({ getToggleButtonProps, getItemProps, selectedItem }) => {
          const selectedItems = [].concat(selectedItem);
          return (
            <div className={containerClass}>
              <div className="title">{title}</div>
              <div className="drop-container">
                <div
                  className={'drop-bar' + (isOpen ? ' open' : '')}
                  {...getToggleButtonProps()}
                  onClick={this.toggleDropdown.bind(this)}
                >
                {selectedCount === 0 && defaultText ? defaultText : null}
                  {selectedCount > maxTagCount ? (
                    <Tag
                      color="dark-grey"
                      removable
                      onClick={this.removeAllSelections.bind(this)}
                    >
                      {selectedCount}/{itemsCount}
                    </Tag>
                  ) : null}
                  {selectedCount <= maxTagCount
                    ? listItems
                        .filter(item => selectedItems.includes(item.id))
                        .map(item => (
                          <Tag
                            className="tag"
                            color="light-grey"
                            removable
                            key={item.id}
                            onClick={evt => this.removeSelection(evt, item.id)}
                          >
                            {item.name}
                          </Tag>
                        ))
                    : null}
                </div>
                {isOpen ? (
                  <div className="drop-menu">
                    <List
                      containerClass="drop-menu-list"
                      items={listItems}
                      iconIndicator={iconIndicator}
                      onClick={(item, evt) => {
                        getItemProps({ item }).onClick(evt);
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          );
        }}
      </Downshift>
    );
  }
}

Dropdown.defaultProps = {
  title: 'Dropdown Menu',
  items: [],
  defaultSelection: [],
  multiselect: false,
  layout: 'vertical',
  tags: true,
  onChange: () => {}
};

export default Dropdown;
