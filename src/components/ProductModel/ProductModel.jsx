import React from 'react';
// import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styles from './ProductModel.module.css';

function ProductModel() {
  return (
    <NavLink className={styles.linkContainer}>
      <div className={styles.productModel}>
        <div className={styles.imageContainer}>
          <img src="https://srv.latostadora.com/designall.dll/don_bosco_is_alive_-_hombre_manga_corta_blanco_calidad_extra--i:13562335307080135623201709265;c:3530708;s:H_A5;w:700;h:520;k:15351957c8bdf84568c723cb9965a1c0.jpg" alt="" />
        </div>
        <div className={styles.infoContainer}>
          <h3 className={styles.productName}>Camisas de diario asdfasdf</h3>
          <p className={styles.productType}>Camisa formal</p>
          <p className={styles.organization}>Colegio Don Bosco</p>
          <div className={styles.colorsContainer}>
            <span className={styles.color} />
            <span className={styles.color} />
            <span className={styles.color} />
          </div>
        </div>
      </div>
    </NavLink>
  );
}

export default ProductModel;

ProductModel.propTypes = {

};

ProductModel.defaultProps = {

};
