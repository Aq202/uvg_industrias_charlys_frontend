import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { serverHost } from '@/config';
import Spinner from '@components/Spinner';
import styles from './InventoryDetails.module.css';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';

function InventoryDetails({ itemId }) {
  const [info, setInfo] = useState({});
  const [itemType, setItemType] = useState('');
  const token = useToken();
  const {
    callFetch, result, error, loading,
  } = useFetch();

  useEffect(() => {
    if (!result) return;
    setInfo(() => (result[0]));
    setItemType(() => result[0].type);
  }, [result]);

  useEffect(() => {
  }, [error]);

  useEffect(() => {
    const uri = `${serverHost}/inventory/material?id=${itemId}`;
    callFetch({
      uri,
      method: 'GET',
      headers: { Authorization: token },
      removeContentType: true,
    });
  }, []);

  return (
    <div className={styles.mainContainer}>
      {loading && (
        <Spinner />
      )}
      {!loading && !error && (
        <div className={styles.detailsContainer}>
          <span className={styles.title}>
            {'Descripción del '}
            {itemType.toLowerCase()}
          </span>
          <hr className={styles.divider} />
          <div className={styles.rowContainer}>
            <div className={styles.sectionContainer}>
              <span className={styles.sectionTitle}>Descripción</span>
              <span className={styles.sectionContent}>
                {info.materialName}
              </span>
            </div>
            <div className={styles.sectionContainer}>
              <span className={styles.sectionTitle}>Categoría</span>
              <span className={styles.sectionContent}>{info.materialType}</span>
            </div>
          </div>
          <div className={styles.rowContainer}>
            <div className={styles.sectionContainer}>
              <span className={styles.sectionTitle}>Cantidad</span>
              <span className={styles.sectionContent}>{`${info.quantity} ${info.measurementUnit}`}</span>
            </div>
            <div className={styles.sectionContainer}>
              <span className={styles.sectionTitle}>Proveedor</span>
              <span className={styles.sectionContent}>{info.supplier}</span>
            </div>
          </div>
          <div className={styles.rowContainer}>
            <div className={styles.sectionContainer}>
              <span className={styles.sectionTitle}>Detalles</span>
              <span className={styles.sectionContent}>{info.details}</span>
            </div>
          </div>
        </div>
      )}
      {error && (
        <span>Ocurrió un error al buscar los detalles de este artículo</span>
      )}
    </div>
  );
}

InventoryDetails.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default InventoryDetails;
