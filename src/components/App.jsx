import React from 'react';
import uniqueId from 'lodash/uniqueId';
import pickBy from 'lodash/pickBy';
import isEqual from 'lodash/isEqual';
import { DragDropContext } from 'react-beautiful-dnd';

import Button from './Button';
import PointsList from './PointsList';
import Map from './Map';
import Form from './Form';

import getYandexMapFacade from '../facades/yandexMapFacade';
import { DEFAULT_MAP_CENTER } from '../tools/const';

class App extends React.Component {
  constructor(props) {
    super(props);

    const { points, pointsIds } = this.props;
    this.state = {
      points,
      pointsIds,
      addingNewPoint: false,
      center: DEFAULT_MAP_CENTER,
      mapLoaded: false,
      map: null,
    };
  }

  static defaultProps = {
    points: {},
    pointsIds: [],
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.shouldRenderPoints(prevState)) {
      const mapFacade = this.getMapFacade();

      mapFacade.clearMap();
      mapFacade.renderPoints();
      mapFacade.renderRoute();
    }
  }

  openNewPointForm = () => {
    this.setState(() => ({ addingNewPoint: true }));
  };

  closeNewPointForm = () => {
    this.setState(() => ({ addingNewPoint: false }));
  };

  addPoint = newPointName => {
    const mapFacade = this.getMapFacade();
    const id = uniqueId();
    const center = mapFacade.getCenter();
    const newPointData = { id, name: newPointName, coordinates: center };

    this.setState(({ points, pointsIds }) => ({
      points: {
        ...points,
        [id]: newPointData,
      },
      pointsIds: [...pointsIds, id],
    }));
  };

  removePoint = pointId => {
    this.setState(({ points, pointsIds }) => ({
      points: pickBy(points, ({ id }) => id !== pointId),
      pointsIds: pointsIds.filter(id => id !== pointId),
    }));
  };

  swapListItems = ({ destination, draggableId, source }) => {
    if (!destination) {
      return;
    }

    const { index: sourceIndex } = source;
    const { index: destinationIndex } = destination;

    if (destinationIndex === sourceIndex) {
      return;
    }

    this.setState(({ pointsIds }) => {
      const updatedPointsIds = pointsIds.slice();

      updatedPointsIds.splice(sourceIndex, 1);
      updatedPointsIds.splice(destinationIndex, 0, draggableId);

      return { pointsIds: updatedPointsIds };
    });
  };

  onYandexMapInitialScriptLoad = () => {
    const { ymaps } = window;
    ymaps.ready(this.initMap);
  };

  initMap = () => {
    const { center, zoom = 15 } = this.state;
    const { ymaps } = window;
    const map = new ymaps.Map('map', { center, zoom });
    this.setState(() => ({
      mapLoaded: true,
      map,
    }));
  };

  getMapFacade = () => {
    const { map, points, pointsIds } = this.state;

    return getYandexMapFacade(map, points, pointsIds, this.onPointDragEnd);
  };

  onPointDragEnd = id => evt => {
    const movedPoint = evt.get('target');
    const movedPointCoordinates = movedPoint.geometry.getCoordinates();

    this.setState(({ points }) => ({
      points: {
        ...points,
        [id]: { ...points[id], coordinates: movedPointCoordinates },
      },
    }));
  };

  shouldRenderPoints = prevState => {
    const { points: prevPoints, pointsIds: prevPointsIds } = prevState;
    const { points, pointsIds } = this.state;

    return !isEqual(prevPoints, points) || !isEqual(prevPointsIds, pointsIds);
  };

  render() {
    const { points, addingNewPoint, pointsIds, mapLoaded } = this.state;

    return (
      <DragDropContext onDragEnd={this.swapListItems}>
        <div className="app">
          <header className="app__header header">Funbox test app</header>
          <div className="app__container">
            <div className="app__points points">
              {!addingNewPoint && (
                <Button
                  onClick={this.openNewPointForm}
                  text="Новая точка маршрута"
                  disabled={!mapLoaded || addingNewPoint}
                  className="points__add-point-button button--big"
                />
              )}

              {addingNewPoint && (
                <Form
                  onSubmit={this.addPoint}
                  onClose={this.closeNewPointForm}
                />
              )}
              {pointsIds.length > 0 && (
                <PointsList
                  points={points}
                  pointsIds={pointsIds}
                  onPointRemove={this.removePoint}
                />
              )}
            </div>
            <Map
              onMapApiInitialScriptLoad={this.onYandexMapInitialScriptLoad}
              className="app__map"
            />
          </div>
        </div>
      </DragDropContext>
    );
  }
}

export default App;
