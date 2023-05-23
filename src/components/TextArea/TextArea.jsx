import React from 'react';
import PropTypes from 'prop-types';
import randomId from '@helpers/randomString';
import styles from './TextArea.module.css';

function TextArea({
  title, error, value, onChange, name, className, ...props
}) {
  const id = randomId(15);
  return (
    <div className={`${styles.inputTextContainer} ${className} ${error ? styles.error : ''}`}>
      <label htmlFor={id}>
        {title}
      </label>
      <textarea type="text" {...props} id={id} name={name} defaultValue={value} onChange={onChange} />
      {error && <div className={styles.inputError}>{error}</div>}
    </div>
  );
}

TextArea.propTypes = {
  title: PropTypes.string.isRequired,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
};

TextArea.defaultProps = {
  error: null,
  value: '',
  name: randomId(15),
  className: '',
};

export default TextArea;
