import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { BsCardImage as ImageIcon } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import styles from './ProductDetailsPage.module.css';
import ImageViewer from '../../components/ImageViewer/ImageViewer';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import randomString from '../../helpers/randomString';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import LoadingView from '../../components/LoadingView/LoadingView';
import Button from '../../components/Button/Button';
import consts from '../../helpers/consts';
import getTokenPayload from '../../helpers/getTokenPayload';

function ProductDetailsPage({ model }) {
  const { id } = useParams();

  const {
    callFetch: fetchProductData, result: productData, loading, error,
  } = useFetch();

  const [isAdmin, setIsAdmin] = useState();

  const token = useToken();

  useEffect(() => {
    if (!id || !token) return;
    const uri = model ? `${serverHost}/product/model/${id}` : `${serverHost}/product/${id}`;
    fetchProductData({ uri, header: { authorization: token } });
  }, [id]);

  useEffect(() => {
    if (!token) return;
    const { role } = getTokenPayload(token);
    setIsAdmin(role === consts.role.admin);
  }, [token]);

  return (
    <>
      {productData && (
      <div className={styles.productDetailsPage}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Detalles de producto</h1>
          {isAdmin && (
          <Link to="editar">
            <Button text="Editar" />
          </Link>
          )}
        </header>
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

        </div>
      </div>
      )}
      {loading && <LoadingView />}
      {error && <NotFoundPage />}
    </>
  );
}

export default ProductDetailsPage;

ProductDetailsPage.propTypes = {
  model: PropTypes.bool,
};

ProductDetailsPage.defaultProps = {
  model: false,
};
