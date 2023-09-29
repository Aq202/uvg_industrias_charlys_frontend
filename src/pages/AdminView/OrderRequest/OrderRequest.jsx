/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import moment from 'moment';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import useToken from '@hooks//useToken';
import usePopUp from '@hooks/usePopUp';
import ImageViewer from '@components/ImageViewer/ImageViewer';
import SubLoadingView from '@components/SubLoadingView/SubLoadingView';
import ProvisionalClient from '@components/ProvisionalClient/ProvisionalClient';
import Button from '@components/Button/Button';
import Products from '@components/Products/Products';
import Spinner from '@components/Spinner/Spinner';
import SuccessNotificationPopUp from '@components/SuccessNotificationPopUp/SuccessNotificationPopUp';
import ErrorNotificationPopUp from '@components/ErrorNotificationPopUp/ErrorNotificationPopUp';

import { scrollbarGray } from '@styles/scrollbar.module.css';
import styles from './OrderRequest.module.css';

function OrderRequest() {
  const {
    callFetch, result, error, loading,
  } = useFetch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const token = useToken();

  const {
    callFetch: postOrder, result: resultPost, error: errorPost, loading: loadingPost,
  } = useFetch();

  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pendiente backend: manejar la información agregada por el admin

    const body = { idOrderRequest: result.id };
    postOrder({
      uri: `${serverHost}/order/`,
      method: 'POST',
      headers: { authorization: token },
      body: JSON.stringify(body),
    });
  };

  const redirectAfterSubmit = () => navigate('/');

  const handleEdit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (!orderId && !token) return;
    callFetch({
      uri: `${serverHost}/orderRequest/${orderId}`,
      headers: {
        authorization: token,
      },
    });
  }, [orderId, token]);

  useEffect(() => {
    if (!errorPost) return;
    openError();
  }, [errorPost]);

  useEffect(() => {
    if (!resultPost) return;
    openSuccess();
  }, [resultPost]);

  return (
    <div className={`${styles.OrderRequest}`}>
      <main>
        <div className={`${styles.top}`}>
          <span className={`${styles.title}`}>Solicitud de pedido</span>
        </div>
        {result?.temporaryClient
            && (
              <ProvisionalClient
                orderId={orderId}
                clientInfo={result?.temporaryClient}
              />
            )}
        <div className={`${styles.details}`}>
          {error && 'Ocurrió un error.'}
          <div className={`${styles.orderInfoContainer}`}>
            {loading && <SubLoadingView />}

            <div className={`${styles.orderInfoHeader}`}>
              <div className={`${styles.editOrderContainer}`}>
                <Button
                  className={styles.editOrderButton}
                  type="submit"
                  text="Editar solicitud de pedido"
                  name="denyOrder"
                  onClick={handleEdit}
                />
              </div>
              {result?.clientOrganization
                && (
                  <div className={styles.clientInfoContainer}>
                    <strong>Cliente: </strong>
                    {result?.clientOrganization.name}
                  </div>
                )}
              <div className={styles.headerContainer}>
                <p>
                  <strong>Código: </strong>
                  {result?.id}
                </p>
                <p>
                  <strong>Fecha solicitada: </strong>
                  {moment(result?.datePlaced).format('DD-MM-YYYY')}
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
            <div className={`${styles.aditionalDetailsContainer}`}>
              <h3 className={styles.sectionTitle}>Detalles Adicionales</h3>
              {result?.details ? result?.details : 'Sin detalles adicionales.'}
            </div>
            <div className={`${styles.productsContainer}`}>
              <div className={`${styles.productsContainerHeader}`}>
                <h3 className={styles.sectionTitle}>Productos a realizar</h3>
              </div>
              {result?.detail && result?.detail.length > 0 ? (
                <Products
                  products={
                    result.detail.map((item) => ({ ...item, organization: result.clientOrganization.name || '' }))
                  }
                />
              )
                : (
                  <div className={`${styles.noProductsMessage}`}>
                    No hay productos seleccionados para esta solicitud de orden.
                  </div>
                )}
            </div>
            <div className={`${styles.deliveryInfoContainer}`}>
              <div className={`${styles.deliveryDate}`}>
                <h3 className={styles.sectionTitle}>Fecha de entrega</h3>
                {result?.deadline ? moment(result?.deadline).format('DD-MM-YYYY') : 'Fecha sin asignar'}
              </div>
              <div className={`${styles.deliveryCost}`}>
                <h3 className={styles.sectionTitle}>Cotización inicial</h3>
                {result?.price ? result?.price : 'No tiene cotización'}
              </div>
            </div>
          </div>
          <div className={`${styles.bottom}`}>
            {!loadingPost && (
            <div className={`${styles.bottomForm}`}>
              <Button className={styles.denyOrderButton} type="submit" text="Rechazar pedido" name="denyOrder" secondary onClick={handleSubmit} />
              <Button className={styles.aceptOrderButton} type="submit" text="Iniciar pedido" name="aceptOrder" onClick={handleSubmit} />
            </div>
            )}
            {loadingPost && <Spinner />}
          </div>
        </div>
      </main>
      <SuccessNotificationPopUp
        title="Listo"
        text="La solicitud de pedido fue realizada correctamente"
        close={closeSuccess}
        isOpen={isSuccessOpen}
        callback={redirectAfterSubmit}
      />
      <ErrorNotificationPopUp
        title="Error"
        text="Ocurrió un error al realizar la solicitud de pedido"
        close={closeError}
        isOpen={isErrorOpen}
      />
    </div>
  );
}

export default OrderRequest;
