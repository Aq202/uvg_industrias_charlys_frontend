import React from 'react';
import PropTypes from 'prop-types';
import styles from './FabricInventory.module.css';

function FabricInventory({
  id, name, color, amount,
}) {
  return (
    <div className={`${styles.fabric}`}>
      <span>{id}</span>
      <span>{name}</span>
      <span>{color}</span>
      <span>{amount}</span>
    </div>
  );
}

FabricInventory.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
};

export default FabricInventory;
