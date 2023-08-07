import React from 'react';
// import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styles from './OrganizationProductsPage.module.css';
import ProductFilter from '../../components/ProductFilter/ProductFilter';
import ProductModel from '../../components/ProductModel/ProductModel';
import Button from '../../components/Button/Button';

function OrganizationProductsPage() {
  return (
    <div className={styles.organizationProductsPage}>
      <header className={styles.pageHeader}>
        <h1>Productos</h1>
        <NavLink to="/hey">
          <Button text="Nuevo producto" name="new-product" />
        </NavLink>
      </header>
      <ProductFilter className={styles.productFilter} idOrganization="ORG000000000003" onChange={() => {}} />
      <div className={styles.productsContainer}>
        <ProductModel
          url="/hey"
          name="Camisa conmemorativa DB"
          imageUrl="https://srv.latostadora.com/designall.dll/don_bosco_is_alive_-_hombre_manga_corta_blanco_calidad_extra--i:13562335307080135623201709265;c:3530708;s:H_A5;w:700;h:520;k:15351957c8bdf84568c723cb9965a1c0.jpg"
          type="Camisa playera"
          organization="Colegio Don Bosco"
          colors={[{
            name: 'rojo', r: 255, b: 0, g: 0,
          },
          {
            name: 'verde', r: 0, b: 0, g: 255,
          },
          ]}
        />
      </div>
    </div>
  );
}

export default OrganizationProductsPage;

OrganizationProductsPage.propTypes = {};

OrganizationProductsPage.defaultProps = {};
