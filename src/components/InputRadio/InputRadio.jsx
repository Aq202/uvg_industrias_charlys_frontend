import React from 'react';
import PropTypes from 'prop-types';
import randomString from '@helpers/randomString';
import styles from './InputRadio.module.css';

function InputRadio({
  title, options, error, value, onChange, name, ...props
}) {
  return (
    <div className={`${styles.inputContainer} ${error ? styles.error : ''}`}>
      <span className={styles.inputTitle}>{title}</span>
      <div className={styles.inputBox}>
        {options?.map((op) => (
          <div className={styles.radioContainer} key={randomString(10)}>
            <input
              type="radio"
              id={op.value}
              name={name}
              defaultChecked={value === op.value}
              onChange={onChange}
              value={op.value}
              {...props}
            />
            <label htmlFor={op.value}>{op.title}</label>
          </div>
        ))}
      </div>
      {error && <div className={styles.inputError}>{error}</div>}
    </div>
  );
}

InputRadio.propTypes = {
  title: PropTypes.string.isRequired,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

InputRadio.defaultProps = {
  error: null,
  value: '',
  name: '',
};

export default InputRadio;
