import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

function Button({
  text,
  onClick,
  type = 'primary',
}) {
  return (
    <button
      className={`${styles.button} ${type === 'primary' ? styles.primary : styles.secondary}`}
      type="button"
      onClick={() => {
        onClick();
      }}
    >
      <span>{text}</span>
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.isRequired,
  type: PropTypes.string.isRequired,
};
export default Button;
