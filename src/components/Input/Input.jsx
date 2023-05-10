import React from 'react';
import PropTypes from 'prop-types';
import styles from './Input.module.css';

function Input({
  name,
  onChange,
  type,
  placeholder,
}) {
  return (
    <div className={styles.inputContainer}>
      <input
        id={name}
        name={name}
        type={type}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.isRequired,
  type: PropTypes.isRequired,
  placeholder: PropTypes.isRequired,
};

export default Input;
