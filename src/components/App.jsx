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
    this.state = {
      points: {
        test1: {
          coordinates: [55.759, 37.64],
          id: 'test1',
          name: 'point one',
        },
        test2: {
          coordinates: [55.7621, 37.6429],
          id: 'test2',
          name: 'point two',
        },
        test3: {
          coordinates: [55.76029, 37.6482],
          id: 'test3',
          name: 'point three',
        },
        test4: {
          coordinates: [55.75556, 37.6488],
          id: 'test4',
          name: 'point four',
        },
      },
      pointsIds: ['test1', 'test2', 'test3', 'test4'],
      addingNewPoint: false,
      center: DEFAULT_MAP_CENTER, // TODO: тянуть из геолокации
      mapLoaded: false,
      map: null,
    };
  }

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
    const { points, addingNewPoint, pointsIds, center, mapLoaded } = this.state;

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
                  disabled={!mapLoaded}
                  className={['points__add-point-button', 'button_big']}
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
              points={points}
              center={center}
              onMapApiInitialScriptLoad={this.onYandexMapInitialScriptLoad}
              mapLoaded={mapLoaded}
              className="app__map"
            />
          </div>
        </div>
      </DragDropContext>
    );
  }
}

export default App;
