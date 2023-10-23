import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import moment from 'moment';
import styles from './EditOrderPage.module.css';
import useFetch from '../../../hooks/useFetch';
import LoadingView from '../../../components/LoadingView/LoadingView';
import { serverHost } from '../../../config';
import useToken from '../../../hooks/useToken';

function EditOrderPage() {
  const { orderId } = useParams();
  const token = useToken();

  const {
    callFetch: fetchInfo,
    result: resultInfo,
    loading: loadingInfo,
    error: errorInfo,
  } = useFetch();

  useEffect(() => {
    console.log(resultInfo);
  }, [resultInfo]);

  useEffect(() => {
    fetchInfo({
      uri: `${serverHost}/orderRequest/${orderId}`,
      headers: {
        authorization: token,
      },
    });
  }, []);

  return (
    <div className={styles.editOrderPage}>
      <h1 className={styles.pageTitle}>Editar solicitud de pedido</h1>
      <div className={styles.orderInfoContainer}>
        {errorInfo && <p>Ocurrió un error al obtener la información del pedido</p>}
        {resultInfo && (
        <div className={styles.orderInfo}>
          <div className={styles.clientInfoContainer}>
            <strong>Cliente: </strong>
            {resultInfo.clientOrganization ? resultInfo.clientOrganization.name : 'Cliente no registrado'}
          </div>
          <div className={styles.headerContainer}>
            <p>
              <strong>Código: </strong>
              {resultInfo.id}
            </p>
            <p>
              <strong>Fecha solicitada: </strong>
              {moment(resultInfo.datePlaced).format('DD-MM-YYYY')}
            </p>
          </div>
          <div className={`${styles.detalles}`}>
            <strong>Detalles: </strong>
            <p>{resultInfo.description}</p>
          </div>
        </div>
        )}
      </div>
      {loadingInfo && <LoadingView />}
    </div>
  );
}

export default EditOrderPage;
