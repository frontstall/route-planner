import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

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
      ...props
    } = this.props;

    const classes = cn('button', className);

    return (
      <button
        className={classes}
        type={type}
        onClick={this.onClick}
        disabled={disabled}
        {...props}
      >
        {text}
      </button>
    );
  }
}

Button.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
