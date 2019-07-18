import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import Button from './Button';

class Point extends React.Component {
  removePoint = id => () => {
    const { onRemove } = this.props;
    onRemove(id);
  };

  render() {
    const { name, id, index } = this.props;
    return (
      <Draggable draggableId={id} index={index}>
        {({ draggableProps, dragHandleProps, innerRef }) => (
          <li
            className="points-list__item point"
            {...draggableProps}
            {...dragHandleProps}
            ref={innerRef}
          >
            <span>{name}</span>
            <Button text="x" onClick={this.removePoint(id)} />
          </li>
        )}
      </Draggable>
    );
  }
}

export default Point;
