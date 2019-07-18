import React from 'react';
import { YANDEX_MAP_SCRIPT_SRC } from '../tools/const';
import cn from 'classnames';

class Map extends React.Component {
  componentDidMount() {
    const { onMapApiInitialScriptLoad } = this.props;
    const script = document.createElement('script');

    script.src = YANDEX_MAP_SCRIPT_SRC;
    script.addEventListener('load', onMapApiInitialScriptLoad);
    document.head.appendChild(script);
  }

  render() {
    const { className = '' } = this.props;
    const classes = cn('map', className);

    return <div id="map" className={classes} />;
  }
}

export default Map;
