import React from 'react';
import PropTypes from 'prop-types';
import randomId from '@helpers/randomString';
import styles from './InputDate.module.css';

function InputDate({
  title, error, value, onChange, name, ...props
}) {
  const id = randomId(15);
  return (
    <div className={`${styles.inputContainer} ${error ? styles.error : ''}`}>
      <label htmlFor={id}>
        {title}
      </label>
      <input type="date" {...props} id={id} name={name} value={value} onChange={onChange} />
      {error && <div className={styles.inputError}>{error}</div>}
    </div>
  );
}

InputDate.propTypes = {
  title: PropTypes.string.isRequired,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  name: PropTypes.string,
};

InputDate.defaultProps = {
  error: null,
  value: '',
  name: randomId(15),
};

export default InputDate;
