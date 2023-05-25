import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

function Button({
  text,
  onClick,
  type = 'primary',
  disabled = false,
}) {
  return (
    <button
      className={`${styles.button} ${type === 'primary' ? styles.primary : styles.secondary}`}
      type="button"
      onClick={() => {
        onClick();
      }}
      disabled={disabled}
    >
      <span>{text}</span>
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.isRequired,
  type: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};
export default Button;
