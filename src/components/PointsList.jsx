import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import Point from './Point';

class PointsList extends React.Component {
  render() {
    const { points, pointsIds, onPointRemove } = this.props;
    return (
      <Droppable droppableId="points-list">
        {({ droppableProps, placeholder, innerRef }) => (
          <ul className="points-list" {...droppableProps} ref={innerRef}>
            {pointsIds.map((id, index) => {
              const { name } = points[id];
              return (
                <Point
                  name={name}
                  id={id}
                  key={id}
                  onRemove={onPointRemove}
                  index={index}
                />
              );
            })}
            {placeholder}
          </ul>
        )}
      </Droppable>
    );
  }
}

export default PointsList;
