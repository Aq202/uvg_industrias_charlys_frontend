import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { BsCardImage as ImageIcon } from 'react-icons/bs';
import styles from './ProductDetailsPage.module.css';
import ImageViewer from '../../components/ImageViewer/ImageViewer';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import SubLoadingView from '../../components/SubLoadingView/SubLoadingView';
import randomString from '../../helpers/randomString';

function ProductDetailsPage({ model }) {
  const { id } = useParams();

  const { callFetch: fetchProductData, result: productData, loading } = useFetch();

  const token = useToken();

  useEffect(() => {
    console.log(productData);
  }, [productData]);

  useEffect(() => {
    if (!id) return;
    console.log(id);
    const uri = model ? `${serverHost}/product/model/${id}` : '';
    fetchProductData({ uri, header: { authorization: token } });
  }, [id]);

  return (
    <div className={styles.productDetailsPage}>
      <h1 className={styles.pageTitle}>Detalles de producto</h1>
      <div className={styles.pageContainer}>
        <div className={styles.dataContainer}>
          <h3 className={styles.dataTitle}>Organización cliente</h3>
          <p className={styles.data}>{productData?.client}</p>

          <h3 className={styles.dataTitle}>Nombre de producto</h3>
          <p className={styles.data}>{productData?.description}</p>

          <h3 className={styles.dataTitle}>Tipo de producto</h3>
          <p className={styles.data}>{productData?.type}</p>

          <h3 className={styles.dataTitle}>Colores</h3>

          {productData?.colors?.length > 0 ? (
            <div className={styles.colorsContainer}>
              {productData?.colors?.map((color) => (
                <span
                  key={randomString()}
                  className={styles.color}
                  style={{ backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})` }}
                  title={color.name}
                />
              ))}
            </div>
          ) : <p className={styles.data}>Sin colores</p>}

          <h3 className={styles.dataTitle}>Detalles</h3>
          <p className={styles.data}>
            {productData?.details?.trim().length > 0 ? productData.details : 'Sin descripción'}
          </p>
        </div>
        <div className={styles.mediaContainer}>
          {productData?.media?.length > 0
            ? <ImageViewer images={productData?.media} className={styles.imageViewer} /> : (
              !loading && (
              <div className={styles.noMediaContainer}>
                <ImageIcon className={styles.imageIcon} />
                <span>Sin recursos multimedia</span>
              </div>
              )
            )}
        </div>

        {loading && <SubLoadingView />}
      </div>
    </div>
  );
}

export default ProductDetailsPage;

ProductDetailsPage.propTypes = {
  model: PropTypes.bool,
};

ProductDetailsPage.defaultProps = {
  model: false,
};
