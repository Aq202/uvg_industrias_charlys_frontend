import React from 'react';
import PropTypes from 'prop-types';
import randomId from '@helpers/randomString';
import styles from './InputNumber.module.css';

function InputNumber({
  title, measureUnit, error, value, onChange, name, ...props
}) {
  const id = randomId(15);
  return (
    <div className={`${styles.inputTextContainer} ${error ? styles.error : ''}`}>
      <label htmlFor={id}>
        {title}
      </label>
      <div className={styles.inputBox}>
        <input type="number" name={name} step=".01" {...props} id={id} value={value} onChange={onChange} />
        {measureUnit && <span className={styles.measureUnit}>{measureUnit}</span>}
      </div>
      {error && <div className={styles.inputError}>{error}</div>}
    </div>
  );
}

InputNumber.propTypes = {
  title: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  name: PropTypes.string,
  measureUnit: PropTypes.string,
};

InputNumber.defaultProps = {
  error: null,
  value: '',
  name: '',
  measureUnit: null,
  title: '',
  onChange: null,
};

export default InputNumber;
