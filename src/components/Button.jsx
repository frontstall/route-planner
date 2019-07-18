import React from 'react';
import cn from 'classnames';

class Button extends React.Component {
  onClick = () => {
    const { onClick } = this.props;

    if (onClick) {
      onClick();
    }
  };

  render() {
    const {
      text = '',
      type = 'button',
      className = '',
      disabled = false,
    } = this.props;

    const classes = cn('button', className);

    return (
      <button
        className={classes}
        type={type}
        onClick={this.onClick}
        disabled={disabled}
      >
        {text}
      </button>
    );
  }
}

export default Button;
