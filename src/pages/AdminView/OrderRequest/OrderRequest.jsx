import React, { useEffect, useState } from 'react';
import { serverHost } from '@/config';
import moment from 'moment';
import useFetch from '@hooks/useFetch';
import useToken from '@hooks//useToken';
import ImageViewer from '@components/ImageViewer/ImageViewer';
import SubLoadingView from '@components/SubLoadingView/SubLoadingView';
import DropdownMenu from '@components/DropdownMenuOrg/DropdownMenu';
import TextArea from '@components/TextArea/TextArea';
import Product from '@components/Product/Product';
import Button from '@components/Button/Button';
import InputDate from '@components/InputDate';
import InputNumber from '@components/InputNumber';
import { useParams } from 'react-router';
import { scrollbarGray } from '@styles/scrollbar.module.css';
import alertDialog from '../../../assets/alert_dialog.svg';
import styles from './OrderRequest.module.css';

function OrderRequest() {
  // FALTA
  // Agregar el PopUp para la creación de la organización
  // Realizar el post para envíar el pedido confirmado
  // Agregar el PopUp para poder agregar productos
  // SUGERENCIA: Cambiar los valores de la tabla de la cantidad de prendas por talla a un
  // input number, para poder cambiar esos valores
  const {
    callFetch, result, error, loading,
  } = useFetch();

  const { orderId } = useParams();
  const token = useToken();
  const [form, setForm] = useState({});
  const [errorForm, setErrorForm] = useState({});

  useEffect(() => {
    if (!orderId && !token) return;
    callFetch({
      uri: `${serverHost}/orderRequest/${orderId}`,
      headers: {
        authorization: token,
      },
    });
  }, [orderId, token]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const clearFieldError = (e) => {
    const { name } = e.target;
    setErrorForm((lastErrors) => ({
      ...lastErrors,
      [name]: null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pendiente: POST
  };

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
              <div className={styles.clientInfoContainer}>
                <strong>Cliente: </strong>
                <DropdownMenu selected={result?.clientOrganization ?? result?.temporaryClient} />
              </div>
              {result?.temporaryClient
              && (
                <div className={styles.createOrganitationBannerContainer}>
                  <img className={styles.alertDialog} src={alertDialog} alt="alert_dialog" />
                  Este pedido fue realizado por un cliente provisional.
                  <Button className={styles.createOrgButton} type="submit" text="Crear organizacion" name="createOrg" secondary onClick={handleSubmit} />
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
              <TextArea
                title=""
                className={styles.textarea}
                name="aditionalDetails"
                onChange={handleChange}
                value={form.aditionalDetails}
                error={errorForm.details}
                onFocus={clearFieldError}
              />
            </div>
            <div className={`${styles.productsContainer}`}>
              <div className={`${styles.productsContainerHeader}`}>
                <h3 className={styles.sectionTitle}>Productos a realizar</h3>
                <Button className={styles.addProduct} text="Agregar" name="buttonProduct" />
              </div>
              {result?.detail.length > 0 ? result?.detail.map((product) => (
                <Product id={product.id} size={product.size} quantity={product.quantity} />
              ))
                : (
                  <div className={`${styles.noProductsMessage}`}>
                    No hay productos seleccionados para esta solicitud de orden.
                  </div>
                )}
              <div className={`${styles.deliveryInfoContainer}`}>
                <div className={`${styles.deliveryDate}`}>
                  <h3 className={styles.sectionTitle}>Fecha de entrega</h3>
                  <InputDate
                    className={styles.deliveryDateInput}
                    title=""
                    name="deliveryDate"
                    onChange={handleChange}
                    value={form.deliveryDate}
                    error={errorForm.deliveryDate}
                  />
                </div>
                <div className={`${styles.deliveryCost}`}>
                  <h3 className={styles.sectionTitle}>Cotización inicial</h3>
                  <InputNumber
                    title=""
                    name="cost"
                    onChange={handleChange}
                    value={form.cost}
                    min={0}
                    step={1}
                    error={errorForm.cost}
                    onFocus={clearFieldError}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.bottom}`}>
            <div className={`${styles.bottomForm}`}>
              <Button className={styles.denyOrderButton} type="submit" text="Rechazar pedido" name="denyOrder" secondary onClick={handleSubmit} />
              <Button className={styles.aceptOrderButton} type="submit" text="Iniciar pedido" name="aceptOrder" onClick={handleSubmit} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderRequest;
