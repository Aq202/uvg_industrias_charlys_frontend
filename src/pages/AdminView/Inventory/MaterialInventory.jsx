import React from 'react';
import PropTypes from 'prop-types';
import styles from './MaterialInventory.module.css';

function MaterialInventory({ id, desc, amount }) {
  return (
    <div className={`${styles.material}`}>
      <span>{id}</span>
      <span>{desc}</span>
      <span>{amount}</span>
    </div>
  );
}

MaterialInventory.propTypes = {
  id: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
};

export default MaterialInventory;
