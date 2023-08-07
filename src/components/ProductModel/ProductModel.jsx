import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styles from './ProductModel.module.css';
import randomString from '../../helpers/randomString';

function ProductModel({
  url, name, imageUrl, type, organization, colors,
}) {
  return (
    <NavLink to={url} className={styles.linkContainer}>
      <div className={styles.productModel}>
        <div className={styles.imageContainer}>
          <img
            src={imageUrl}
            alt="Imagen descriptiva del producto"
          />
        </div>
        <div className={styles.infoContainer}>
          <h3 className={styles.productName}>{name}</h3>
          <p className={styles.productType}>{type}</p>
          <p className={styles.organization}>{organization}</p>
          <div className={styles.colorsContainer}>
            {colors?.map((color) => (
              <span
                key={randomString()}
                className={styles.color}
                style={{ backgroundColor: `rgb(${color.r}, ${color.g}), ${color.b}` }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>
    </NavLink>
  );
}

export default ProductModel;

ProductModel.propTypes = {
  url: PropTypes.string,
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  type: PropTypes.string.isRequired,
  organization: PropTypes.string.isRequired,
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      r: PropTypes.number.isRequired,
      g: PropTypes.number.isRequired,
      b: PropTypes.number.isRequired,
    }),
  ),
};

ProductModel.defaultProps = {
  url: '',
  imageUrl: null,
  colors: null,
};
