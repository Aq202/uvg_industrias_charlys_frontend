import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { BsCardImage as ImageIcon } from 'react-icons/bs';
import { TiDelete as DeleteIcon } from 'react-icons/ti';
import styles from './ProductModel.module.css';
import randomString from '../../helpers/randomString';

function ProductModel({
  url,
  name,
  imageUrl,
  type,
  organization,
  colors,
  loadingImage,
  className,
  itemRef,
  onClick,
  onDelete,
}) {
  const [showDefaultImg, setShowDefaultImg] = useState(false);

  useEffect(() => {
    setShowDefaultImg(!imageUrl && !loadingImage);
  }, [imageUrl, loadingImage]);

  const handleImageError = () => {
    setShowDefaultImg(true);
  };

  return (
    <div className={`${styles.productModelContainer} ${className}`}>
      { onDelete && <DeleteIcon className={styles.deleteIcon} onClick={onDelete} /> }
      <NavLink to={url} className={styles.linkContainer} ref={itemRef} onClick={onClick}>
        <div className={styles.productModel}>
          <div className={styles.imageContainer}>
            {!loadingImage && !showDefaultImg && (
            <img
              src={`${imageUrl}`}
              alt="Imagen descriptiva del producto"
              loading="lazy"
              onError={handleImageError}
            />
            )}
            {
            showDefaultImg && (
            <div className={styles.defaultImageContainer}>
              <ImageIcon className={styles.defaultImage} />
            </div>
            )
          }
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
                  style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
      </NavLink>
    </div>
  );
}

export default ProductModel;

ProductModel.propTypes = {
  url: PropTypes.string,
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  type: PropTypes.string.isRequired,
  organization: PropTypes.string,
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      r: PropTypes.number.isRequired,
      g: PropTypes.number.isRequired,
      b: PropTypes.number.isRequired,
    }),
  ),
  loadingImage: PropTypes.bool,
  className: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  itemRef: PropTypes.any,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
};

ProductModel.defaultProps = {
  url: '',
  imageUrl: null,
  colors: null,
  loadingImage: false,
  className: '',
  itemRef: null,
  onClick: null,
  organization: '',
  onDelete: null,
};
