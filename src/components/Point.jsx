import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Draggable } from 'react-beautiful-dnd';

import Button from './Button';

class Point extends React.Component {
  removePoint = id => () => {
    const { onRemove } = this.props;
    onRemove(id);
  };

  render() {
    const { name, id, index, className, address, loading } = this.props;
    const classes = cn('point', className);
    return (
      <Draggable draggableId={id} index={index}>
        {({ draggableProps, dragHandleProps, innerRef }) => (
          <li
            className={classes}
            {...draggableProps}
            {...dragHandleProps}
            ref={innerRef}
          >
            <span className="point__name" title={name}>
              {name}
            </span>
            <span
              className="point__address"
              title={loading ? 'Ищем адрес...' : address}
            >
              {loading ? 'Ищем адрес...' : address}
            </span>
            <Button
              className="point__remove-button button--iconed-cross"
              onClick={this.removePoint(id)}
              title="Удалить"
            />
          </li>
        )}
      </Draggable>
    );
  }
}

Point.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  index: PropTypes.number,
  className: PropTypes.string,
};

export default Point;
