import React, { useEffect } from 'react';
import ImageViewer from '@components/ImageViewer/ImageViewer';
import { serverHost } from '@/config';
import moment from 'moment';
import useFetch from '@hooks/useFetch';
import { useParams } from 'react-router';
import { scrollbarGray } from '@styles/scrollbar.module.css';
import styles from './OrderRequest.module.css';
import useToken from '../../../hooks/useToken';
import SubLoadingView from '../../../components/SubLoadingView/SubLoadingView';

function OrderRequest() {
  const {
    callFetch, result, error, loading,
  } = useFetch();

  const { orderId } = useParams();
  const token = useToken();

  useEffect(() => {
    if (!orderId && !token) return;
    callFetch({
      uri: `${serverHost}/orderRequest/${orderId}`,
      headers: {
        authorization: token,
      },
    });
  }, [orderId, token]);

  return (
    <div className={`${styles.OrderRequest}`}>
      <main>
        <div className={`${styles.top}`}>
          <span className={`${styles.title}`}>Solicitud de pedido</span>
        </div>
        <div className={`${styles.details}`}>
          {error && 'Ocurrió un error.'}

          <div className={`${styles.orderInfoContainer}`}>
            {loading && <SubLoadingView />}

            <div className={`${styles.orderInfoHeader}`}>
              <h3 className={styles.sectionTitle}>Información General</h3>
              <div className={styles.headerContainer}>
                <p>
                  <strong>Código: </strong>
                  {result?.id}
                </p>
                <p>
                  <strong>Fecha solicitada: </strong>
                  {moment(result?.datePlaced).format('DD-MM-YY')}
                </p>
              </div>
            </div>
            <div className={`${styles.detalles}`}>
              <strong>Detalles: </strong>
              <p>{result?.description}</p>
            </div>
            <div className={`${styles.filesContainer}`}>
              <h3 className={styles.sectionTitle}>Archivos adjuntos</h3>
              <div className={`${styles.divFile} ${scrollbarGray}`}>
                {result?.media ? (
                  <div className={styles.imageViewerContainer}>
                    <ImageViewer images={result?.media} />
                  </div>
                ) : (
                  <p className={styles.noImagesMessage}>No hay recursos multimedia adjuntos.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderRequest;
