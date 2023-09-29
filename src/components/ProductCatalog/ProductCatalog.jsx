/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './ProductCatalog.module.css';
import useFetch from '../../hooks/useFetch';
import useApiMultipleImages from '../../hooks/useApiMultipleImages';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import Spinner from '../Spinner/Spinner';
import ProductModel from '../ProductModel/ProductModel';

function ProductCatalog({ orgId, selectProduct }) {
  const token = useToken();
  const [previousProducts, setPreviousProducts] = useState([]);
  const [productImages, setProductImages] = useState({});

  const {
    callFetch: getCatalog, result: resultCatalog, error: errorCatalog, loading: loadingCatalog,
  } = useFetch();

  const {
    getMultipleApiImages, result: resultImages,
  } = useApiMultipleImages();

  const getPreviousProducts = async () => {
    getCatalog({
      uri: `${serverHost}/product/model/by-organization/${orgId}`,
      headers: { authorization: token },
      method: 'POST',
    });
  };

  const getProductImages = async () => {
    const images = [];
    resultCatalog.forEach((product) => {
      images.push({ id: product.id, uri: product.media[0] });
    });
    getMultipleApiImages(images);
  };

  const handleSelectProduct = (product) => {
    const selectedProduct = {
      id: product.id,
      name: product.details,
      type: product.description,
      organization: product.client,
      colors: product.colors,
      imageUrl: productImages[product.id],
    };
    selectProduct(selectedProduct);
  };

  useEffect(() => {
    if (!resultImages) return;
    setProductImages(() => resultImages);
  }, [resultImages]);

  useEffect(() => {
    if (!resultCatalog) return;
    setPreviousProducts(() => resultCatalog);
    getProductImages();
  }, [resultCatalog]);

  useEffect(() => {
    getPreviousProducts();
  }, []);

  return (
    <div className={styles.catalogForm}>
      <h2>Productos de pedidos anteriores</h2>
      {errorCatalog && (
      <p className={styles.secondaryText}>No se encontraron productos pedidos anteriormente</p>)}
      {resultCatalog && (
      <p className={styles.secondaryText}>Selecciona un producto de pedidos anteriores</p>)}
      {resultCatalog
          && (
          <div className={styles.catalogGrid}>
            {previousProducts.length > 0
            && previousProducts.map((product) => (
              <div key={`container${product.id}`} className={styles.productContainer}>
                <div className={styles.productCover} onClick={() => handleSelectProduct(product)} />
                <ProductModel
                  key={product.id}
                  url="/hey"
                  name={product.details}
                  imageUrl={productImages[product.id]}
                  type={product.description}
                  organization={product.client}
                  colors={product.colors}
                />
              </div>
            ))}
          </div>
          )}
      {loadingCatalog && <Spinner />}
    </div>
  );
}

ProductCatalog.propTypes = {
  orgId: PropTypes.string.isRequired,
  selectProduct: PropTypes.func.isRequired,
};

export default ProductCatalog;
