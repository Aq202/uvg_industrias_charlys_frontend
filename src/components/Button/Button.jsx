/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

function Button({
  text,
  onClick,
  type,
  disabled = false,
  blue,
  red,
  emptyRed,
  darkBlue,
  green,
  className,
  name,
  secondary,
}) {
  return (
    <button
      className={`${styles.button} 
      ${blue ? styles.blue : ''}
      ${emptyRed ? styles.emptyRed : ''}
      ${darkBlue ? styles.darkBlue : ''}
      ${red ? styles.red : ''}
      ${green ? styles.green : ''}
      ${className}
      ${secondary ? styles.secondary : ''}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
      name={name}
    >
      <span>{text}</span>
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  blue: PropTypes.bool,
  red: PropTypes.bool,
  emptyRed: PropTypes.bool,
  darkBlue: PropTypes.bool,
  green: PropTypes.bool,
  name: PropTypes.string.isRequired,
  secondary: PropTypes.bool,
};

Button.defaultProps = {
  className: '',
  blue: false,
  red: false,
  emptyRed: false,
  darkBlue: false,
  green: false,
  type: 'button',
  disabled: false,
  onClick: null,
  secondary: false,
};
export default Button;
