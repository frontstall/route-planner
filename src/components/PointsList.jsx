import React from 'react';
import PropTypes from 'prop-types';
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
              const { name, address, loading } = points[id];
              return (
                <Point
                  className="points-list__item"
                  name={name}
                  address={address}
                  id={id}
                  key={id}
                  onRemove={onPointRemove}
                  index={index}
                  loading={loading}
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

PointsList.propTypes = {
  points: PropTypes.object,
  pointsIds: PropTypes.array,
  onPointRemove: PropTypes.func,
};

export default PointsList;
