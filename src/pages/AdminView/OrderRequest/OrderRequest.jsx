/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import moment from 'moment';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import useToken from '@hooks//useToken';
import usePopUp from '@hooks/usePopUp';
import getTokenPayload from '@helpers/getTokenPayload';
import consts from '@helpers/consts';
import ImageViewer from '@components/ImageViewer/ImageViewer';
import LoadingView from '@components/LoadingView';
import ProvisionalClient from '@components/ProvisionalClient/ProvisionalClient';
import Button from '@components/Button/Button';
import Products from '@components/Products/Products';
import Spinner from '@components/Spinner/Spinner';
import SuccessNotificationPopUp from '@components/SuccessNotificationPopUp/SuccessNotificationPopUp';
import ErrorNotificationPopUp from '@components/ErrorNotificationPopUp/ErrorNotificationPopUp';
import ConfirmationPopUp from '@components/ConfirmationPopUp';
import NotFoundPage from '@pages/NotFoundPage/NotFoundPage';
import { scrollbarGray } from '@styles/scrollbar.module.css';
import styles from './OrderRequest.module.css';
import alertDialog from '../../../assets/alert_dialog.svg';

function OrderRequest() {
  const {
    callFetch, result, error, loading,
  } = useFetch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const token = useToken();
  const [userRole, setUserRole] = useState(null);
  const [successMessage, setSuccessMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [doPost, setDoPost] = useState();
  const [doDelete, setDoDelete] = useState();

  const {
    callFetch: postOrder, result: resultPost, error: errorPost, loading: loadingPost,
  } = useFetch();

  const {
    callFetch: deleteOrder, result: resultDelete, error: errorDelete, loading: loadingDelete,
  } = useFetch();

  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();
  const [isConfirmationPostOpen, openConfirmationPost, closeConfirmationPost] = usePopUp();
  const [isConfirmationDeleteOpen, openConfirmationDelete, closeConfirmationDelete] = usePopUp();

  useEffect(() => {
    if (!orderId && !token) return;

    const tokenUserData = getTokenPayload(token);

    if (tokenUserData?.role) setUserRole(tokenUserData?.role);

    callFetch({
      uri: `${serverHost}/orderRequest/${orderId}`,
      headers: {
        authorization: token,
      },
    });
  }, [orderId, token]);

  const handleSubmit = () => {
    const body = { idOrderRequest: orderId };
    postOrder({
      uri: `${serverHost}/order/`,
      method: 'POST',
      headers: { authorization: token },
      body: JSON.stringify(body),
    });
  };

  useEffect(() => {
    if (!errorPost) return;
    setErrorMessage(errorPost.message);
    openError();
  }, [errorPost]);

  useEffect(() => {
    if (!resultPost) return;
    setSuccessMessage(`La solicitud de pedido fue iniciada correctamente. Orden No.${resultPost.id}`);
    openSuccess();
  }, [resultPost]);

  useEffect(() => {
    if (!doPost) return;
    handleSubmit();
  }, [doPost]);

  const handleDelete = () => {
    const body = { idOrderRequest: orderId };
    deleteOrder({
      uri: `${serverHost}/orderRequest/`,
      method: 'DELETE',
      headers: { authorization: token },
      body: JSON.stringify(body),
      parse: false,
    });
  };

  useEffect(() => {
    if (!errorDelete) return;
    setErrorMessage(errorDelete.message);
    openError();
  }, [errorDelete]);

  useEffect(() => {
    if (!resultDelete) return;
    setSuccessMessage(`La solicitud de pedido fue rechazada correctamente. Orden No.${orderId}`);
    openSuccess();
  }, [resultDelete]);

  useEffect(() => {
    if (!doDelete) return;
    handleDelete();
  }, [doDelete]);

  const redirectAfterSubmit = () => navigate(`/produccion/${resultPost.id}/`);
  const redirectAfterDelete = () => navigate('/');

  const handleEdit = (e) => {
    e.preventDefault();
    navigate(`/solicitudOrden/${orderId}/editar`);
  };

  return (
    <div className={`${styles.OrderRequest}`}>
      {error && <NotFoundPage />}
      {loading && <LoadingView />}
      {!error && !loading
          && (
          <main>
            <div className={`${styles.top}`}>
              <span className={`${styles.title}`}>Solicitud de pedido</span>
            </div>
            {result?.temporaryClient && userRole !== consts.role.client
                && (
                  <ProvisionalClient
                    orderId={orderId}
                    clientInfo={result?.temporaryClient}
                  />
                )}
            <div className={`${styles.details}`}>
              <div className={`${styles.orderInfoContainer}`}>
                <div className={`${styles.orderInfoHeader}`}>
                  {userRole !== consts.role.client
                    && (
                    <div className={`${styles.editOrderContainer}`}>
                      <Button
                        className={styles.editOrderButton}
                        type="submit"
                        text="Editar solicitud de pedido"
                        name="denyOrder"
                        onClick={handleEdit}
                        disabled={!result?.clientOrganization}
                      />
                    </div>
                    )}
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
                        <img className={styles.alertDialog} src={alertDialog} alt="alert_dialog" />
                        No hay productos seleccionados para esta solicitud de orden.
                        Debe haber, como mínimo, un producto seleccionado.
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
              {userRole !== consts.role.client
                && (
                <div className={`${styles.bottom}`}>
                  {!loadingPost && !loadingDelete && (
                  <div className={`${styles.bottomForm}`}>
                    <Button
                      className={styles.denyOrderButton}
                      type="submit"
                      text="Rechazar pedido"
                      name="denyOrder"
                      secondary
                      onClick={openConfirmationDelete}
                    />
                    <Button
                      className={styles.aceptOrderButton}
                      type="submit"
                      text="Iniciar pedido"
                      name="aceptOrder"
                      onClick={openConfirmationPost}
                      disabled={!result?.clientOrganization || !result?.detail}
                    />
                  </div>
                  )}
                  {(loadingPost || loadingDelete) && <Spinner />}
                </div>
                )}
            </div>
          </main>
          )}
      <ConfirmationPopUp
        close={closeConfirmationPost}
        isOpen={isConfirmationPostOpen}
        body={`¿Está seguro de aceptar e iniciar la solicitud de pedido No. ${orderId}?`}
        callback={setDoPost}
      />
      <ConfirmationPopUp
        close={closeConfirmationDelete}
        isOpen={isConfirmationDeleteOpen}
        body={`¿Está seguro de rechazar la solicitud de pedido No. ${orderId}?`}
        callback={setDoDelete}
      />
      <SuccessNotificationPopUp
        title="Listo"
        text={successMessage}
        close={closeSuccess}
        isOpen={isSuccessOpen}
        callback={doPost ? redirectAfterSubmit : redirectAfterDelete}
      />
      <ErrorNotificationPopUp
        title="Error"
        text={errorMessage}
        close={closeError}
        isOpen={isErrorOpen}
      />
    </div>
  );
}

export default OrderRequest;
