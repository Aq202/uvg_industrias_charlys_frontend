import React from 'react';
import PropTypes from 'prop-types';
import styles from './CheckboxColorItem.module.css';
import CheckboxItem from '../CheckboxItem/CheckboxItem';

function CheckboxColorItem({
  name,
  onChange,
  checked,
  value,
  className,
  red,
  green,
  blue,
  colorName,
}) {
  return (
    <CheckboxItem
      className={`${className} ${styles.itemContainer}`}
      name={name}
      onChange={onChange}
      checked={checked}
      value={value}
    >
      <span className={styles.color} style={{ backgroundColor: `rgb(${red},${green}, ${blue})` }} />
      {colorName}
    </CheckboxItem>
  );
}

export default CheckboxColorItem;

CheckboxColorItem.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  className: PropTypes.string,
  value: PropTypes.string,
  red: PropTypes.number.isRequired,
  blue: PropTypes.number.isRequired,
  green: PropTypes.number.isRequired,
  colorName: PropTypes.string.isRequired,
};

CheckboxColorItem.defaultProps = {
  checked: false,
  name: '',
  onChange: null,
  className: '',
  value: '',
};
