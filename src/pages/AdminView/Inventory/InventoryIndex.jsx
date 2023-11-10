import React from 'react';
// import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import styles from './InventoryIndex.module.css';
import TabMenu from '../../../components/TabMenu/TabMenu';
import InventoryMaterialsPage from './InventoryMaterialsPage/InventoryMaterialsPage';
import InventoryProductsPage from './InventoryProductsPage/InventoryProductsPage';

function InventoryIndex() {
  return (
    <div className={styles.inventoryIndex}>
      <h1 className={styles.pageTitle}>Inventario</h1>

      <TabMenu options={[{ text: 'Materiales', href: '' }, { text: 'Productos', href: 'producto' }]} />

      <Routes>
        <Route path="/" element={<InventoryMaterialsPage />} />
        <Route path="/producto" element={<InventoryProductsPage />} />
      </Routes>

    </div>
  );
}

export default InventoryIndex;

InventoryIndex.propTypes = {

};

InventoryIndex.defaultProps = {

};
