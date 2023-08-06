import React from 'react';
// import PropTypes from 'prop-types';
import styles from './OrganizationProductsPage.module.css';
import ProductFilter from '../../components/ProductFilter/ProductFilter';
import ProductModel from '../../components/ProductModel/ProductModel';

function OrganizationProductsPage() {
  return (
    <div className={styles.organizationProductsPage}>
      <h1>Productos</h1>
      <ProductFilter />
      <div className={styles.productsContainer}>
        <ProductModel />
        <ProductModel />
        <ProductModel />
        <ProductModel />
        <ProductModel />
        <ProductModel />
        <ProductModel />
        <ProductModel />
        <ProductModel />
        <ProductModel />
        <ProductModel />
        <ProductModel />
      </div>
    </div>
  );
}

export default OrganizationProductsPage;

OrganizationProductsPage.propTypes = {

};

OrganizationProductsPage.defaultProps = {

};
