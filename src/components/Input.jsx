import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

const Input = React.forwardRef(({ className, ...props }, ref) => {
  const classes = cn('input', className);

  return <input className={classes} ref={ref} {...props} />;
});

Input.propTypes = {
  className: PropTypes.string,
};

export default Input;
