import React from 'react';

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

    return (
      <button
        className={className}
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
