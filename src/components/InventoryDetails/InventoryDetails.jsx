import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { serverHost } from '@/config';
import Spinner from '@components/Spinner';
import styles from './InventoryDetails.module.css';
import useFetch from '../../hooks/useFetch';

function InventoryDetails({ itemId }) {
  const [info, setInfo] = useState({});
  const {
    callFetch, result, error, loading,
  } = useFetch();
  useEffect(() => {
    if (!result) return;

    // eslint-disable-next-line no-console
    console.log(result);
    const {
      id, element, quantity, measurementUnit, supplier, details,
    } = result[0];
    setInfo(() => ({
      id, element, quantity, measurementUnit, supplier, details,
    }));
  }, [result]);
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(error);
  }, [error]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(loading);
  }, [loading]);

  useEffect(() => {
    const uri = `${serverHost}/inventory/?search=${itemId}`;
    callFetch({
      uri,
      method: 'GET',
      headers: { Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVMDAwMDAwMDAwMDAwMDEiLCJuYW1lIjoiQWRtaW4iLCJsYXN0TmFtZSI6IiIsInNleCI6Ik0iLCJyb2xlIjoiQURNSU4iLCJleHAiOjE2ODQ5NzIwODYsInR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE2ODQ4ODU2ODZ9.p2eGhhGA8oweJ9AekpU9KjvB70yyET8z23U5SnAnr8M' },
      removeContentType: true,
    });
  }, []);

  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.containerTitle}>Descripción del artículo</h1>
      {loading && <Spinner />}
      {!loading && !error && (
      <div className={styles.detailsContainer}>
        <div className={styles.detail}>
          <p className={styles.detailTitle}>Artículo</p>
          <p className={styles.detailText}>{info.element}</p>
        </div>
        <div className={styles.detail}>
          <p className={styles.detailTitle}>Cantidad</p>
          <p className={styles.detailText}>{`${info.quantity} ${info.measurementUnit}`}</p>
        </div>
        <div className={styles.detail}>
          <p className={styles.detailTitle}>Proveedor</p>
          <p className={styles.detailText}>{info.supplier}</p>
        </div>
        <div className={styles.detail}>
          <p className={styles.detailTitle}>Detalles</p>
          <p className={styles.detailText}>{info.details}</p>
        </div>
      </div>
      )}
      {error && (
      <div>
        <p>Ocurrió un error al buscar información de este artículo</p>
      </div>
      )}
    </div>
  );
}

InventoryDetails.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default InventoryDetails;
