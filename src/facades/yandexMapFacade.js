/**
 * Фасад для работы с картой Яндекс и точками на ней.
 * @param {Object} map инстанс карты, возвращаемый конструктором ymaps.Map
 * @param {Object} points точки
 * @param {Array} pointsIds айдишники точек для определения порядка
 * расположения
 * @param {Function} onPointDragEnd функция для генерации колбеков,
 * вызываемых при перетаскивании маркера на карте. Принимает id, возвращает
 * колбек.
 */

export default (map, points, pointsIds, onPointDragEnd) => {
  const {
    ymaps: { GeoObject },
  } = window;

  const createPoint = (pointData, onDragEnd, iconContent) => {
    const { coordinates, name, id } = pointData;
    const point = new GeoObject(
      {
        geometry: {
          type: 'Point',
          coordinates,
        },
        properties: {
          balloonContent: name,
          id,
          iconContent,
        },
      },
      {
        draggable: true,
        preset: 'islands#blueCircleIcon',
      },
    );

    if (!!onDragEnd) {
      point.events.add('dragend', onDragEnd);
    }

    point.events
      .add('mouseenter', e => {
        e.get('target').options.set({ preset: 'islands#redCircleIcon' });
      })
      .add('mouseleave', e => {
        e.get('target').options.set({ preset: 'islands#blueCircleIcon' });
      });

    return point;
  };

  const renderPoints = () => {
    pointsIds.forEach((id, idx) => {
      const onDragEnd = onPointDragEnd(id);
      const point = createPoint(points[id], onDragEnd, idx + 1);
      map.geoObjects.add(point);
    });
  };

  const createRoute = coordinates => {
    const route = new GeoObject(
      {
        geometry: {
          type: 'LineString',
          coordinates,
        },
      },
      { strokeWidth: 3 },
    );

    return route;
  };

  const getRouteCoordinates = () => pointsIds.map(id => points[id].coordinates);

  const renderRoute = () => {
    const routeCoordinates = getRouteCoordinates();
    const route = createRoute(routeCoordinates);

    map.geoObjects.add(route);
  };

  const clearMap = () => map.geoObjects.removeAll();

  const getCenter = () => map.getCenter();

  return {
    clearMap,
    renderRoute,
    renderPoints,
    getCenter,
  };
};
