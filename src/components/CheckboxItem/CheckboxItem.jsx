import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './CheckboxItem.module.css';
import randomString from '../../helpers/randomString';

function CheckboxItem({
  name, onChange, checked, value, className, children,
}) {
  const [id] = useState(randomString());

  return (
    <label htmlFor={id} className={`${styles.checkboxItem} ${className}`}>
      <input type="checkbox" name={name} onChange={onChange} checked={checked} id={id} value={value} />
      {children}
    </label>
  );
}

export default CheckboxItem;

CheckboxItem.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  value: PropTypes.string,
};

CheckboxItem.defaultProps = {
  checked: false,
  name: '',
  onChange: null,
  className: '',
  children: null,
  value: '',
};
