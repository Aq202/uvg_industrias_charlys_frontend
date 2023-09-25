/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { serverHost } from '@/config';
import moment from 'moment';
import useFetch from '@hooks/useFetch';
import useToken from '@hooks//useToken';
import ImageViewer from '@components/ImageViewer/ImageViewer';
import SubLoadingView from '@components/SubLoadingView/SubLoadingView';
import ProvisionalClient from '@components/ProvisionalClient/ProvisionalClient';
import TextArea from '@components/TextArea/TextArea';
import Button from '@components/Button/Button';
import InputDate from '@components/InputDate';
import InputNumber from '@components/InputNumber';

import { scrollbarGray } from '@styles/scrollbar.module.css';
import PopUp from '../../../components/PopUp/PopUp';
import ProductModel from '../../../components/ProductModel/ProductModel';
import Spinner from '../../../components/Spinner/Spinner';
import usePopUp from '../../../hooks/usePopUp';
import useApiMultipleImages from '../../../hooks/useApiMultipleImages';
import styles from './OrderRequest.module.css';
import SuccessNotificationPopUp from '../../../components/SuccessNotificationPopUp/SuccessNotificationPopUp';
import ErrorNotificationPopUp from '../../../components/ErrorNotificationPopUp/ErrorNotificationPopUp';

function OrderRequest() {
  const {
    callFetch, result, error, loading,
  } = useFetch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const token = useToken();
  const [form, setForm] = useState({});
  const [errorForm, setErrorForm] = useState({});
  const [previousProducts, setPreviousProducts] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [sizes, setSizes] = useState([]);
  const {
    getMultipleApiImages, result: resultImages,
  } = useApiMultipleImages();
  const {
    callFetch: getCatalog, result: resultCatalog, error: errorCatalog, loading: loadingCatalog,
  } = useFetch();
  const {
    callFetch: getSizes, result: resultSizes, error: errorSizes, loading: loadingSizes,
  } = useFetch();
  const {
    callFetch: postOrder, result: resultPost, error: errorPost, loading: loadingPost,
  } = useFetch();
  const [isCatalogOpen, openCatalog, closeCatalog] = usePopUp();
  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();
  // eslint-disable-next-line no-unused-vars
  const [selectedOrg, setSelectedOrg] = useState('');

  const getPreviousProducts = async () => {
    getCatalog({
      uri: `${serverHost}/product/model/by-organization/${result.clientOrganization}`,
      headers: { authorization: token },
      method: 'POST',
    });
  };

  const getAllSizes = async () => {
    getSizes({
      uri: `${serverHost}/generalInfo/size`,
      headers: { authorization: token },
    });
  };

  const getProductImages = async () => {
    const images = [];
    resultCatalog.forEach((product) => {
      images.push({ id: product.id, uri: product.media[0] });
    });
    getMultipleApiImages(images);
  };

  const selectProduct = (product) => {
    if (product.id in selectedProducts) {
      closeCatalog();
      return;
    }
    setSelectedProducts((prevArray) => ({ ...prevArray, [product.id]: product }));
    closeCatalog();
  };

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

  const handleQuantities = (e, id, size) => {
    e.preventDefault();
    const quantity = e.target.value;

    // Create a copy of the current quantities state
    const newQuantities = { ...quantities };

    // Update the quantity for the specified product and size
    newQuantities[id] = {
      ...(newQuantities[id] || {}), // Ensure there's an object for the product
      [size]: quantity,
    };

    // Check if the quantity is 0 and remove the size if it is
    if (quantity === '0' || quantity === '') {
      delete newQuantities[id][size];
    }

    // Check if there are no sizes left for the product and remove the product if needed
    if (Object.keys(newQuantities[id]).length === 0) {
      delete newQuantities[id];
    }

    // Update the state with the new quantities
    setQuantities(newQuantities);
  };

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
    if (!result) return;
    getPreviousProducts();
    getAllSizes();
    // setSelectedOrg(result?.clientOrganization.name);
  }, [result]);

  useEffect(() => {
    if (!result) return;
    if (!resultCatalog) return;
    setPreviousProducts(() => resultCatalog);
    getProductImages();

    const requestedProducts = {};
    result.detail.forEach((product) => {
      requestedProducts[product.id] = {
        name: product.product,
        imageUrl: productImages[product.id],
        client: result.clientOrganization,
      };
    });
    setSelectedProducts(requestedProducts);

    const requestedQuantities = {};
    result.detail.forEach((product) => {
      requestedQuantities[product.id] = { [product.size]: [product.quantity] };
    });
    setQuantities(requestedQuantities);
  }, [resultCatalog]);

  useEffect(() => {
    if (!resultImages) return;
    setProductImages(() => resultImages);
  }, [resultImages]);

  useEffect(() => {
    if (!resultSizes) return;
    setSizes(() => resultSizes);
  }, [resultSizes]);

  useEffect(() => {
    if (!errorPost) return;
    openError();
  }, [errorPost]);

  useEffect(() => {
    if (!resultPost) return;
    openSuccess();
  }, [resultPost]);

  const handleOrgSelection = (selectedValue) => {
    setSelectedOrg(selectedValue);
  };

  return (
    <div className={`${styles.OrderRequest}`}>
      <main>
        {isCatalogOpen
      && (
      <PopUp
        closeButton
        closeWithBackground
        close={closeCatalog}
        maxWidth={1200}
      >
        <div className={styles.catalogForm}>
          <h2>Productos de pedidos anteriores</h2>
          <p className={styles.secondaryText}>Selecciona un producto de pedidos anteriores</p>
          {!loadingCatalog && !errorCatalog
          && (
          <div className={styles.catalogGrid}>
            {previousProducts.length > 0
            && previousProducts.map((product) => (
              <div key={`container${product.id}`} className={styles.productContainer}>
                <div className={styles.productCover} onClick={() => selectProduct(product)} />
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
      </PopUp>
      )}
        <div className={`${styles.top}`}>
          <span className={`${styles.title}`}>Solicitud de pedido</span>
        </div>
        {result?.temporaryClient
            && (
              <ProvisionalClient
                orderId={orderId}
                clientInfo={result?.temporaryClient}
                onSelect={handleOrgSelection}
              />
            )}
        <div className={`${styles.details}`}>
          {error && 'Ocurrió un error.'}
          <div className={`${styles.orderInfoContainer}`}>
            {loading && <SubLoadingView />}

            <div className={`${styles.orderInfoHeader}`}>
              <h3 className={styles.sectionTitle}>Información General</h3>
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
                <Button className={styles.addProduct} onClick={openCatalog} text="Agregar" name="buttonProduct" />
              </div>
              <div className={styles.selectedProductsGrid}>
                {Object.keys(selectedProducts).length > 0
          && Object.keys(selectedProducts).map((key) => (
            <div className={styles.selectedProductContainer}>
              <ProductModel
                key={key}
                url="/hey"
                name={selectedProducts[key].details}
                imageUrl={productImages[key]}
                type={selectedProducts[key].description}
                organization={selectedProducts[key].client}
                colors={selectedProducts[key].colors}
              />
              {resultSizes
              && (
              <div className={styles.sizesTable}>
                <p className={styles.tableHeader}>
                  Modifique la cantidad a producir de cada talla, si es necesario:
                </p>
                  {sizes?.length > 0 && sizes.map((element) => (
                    <div className={styles.tableRow}>
                      <p className={styles.tableItem}>{`${element.size}:`}</p>
                      <InputNumber
                        value={quantities[key]?.[element.size]}
                        onChange={(e) => handleQuantities(e, key, element.size)}
                        step="1"
                        min="0"
                      />
                    </div>
                  ))}
              </div>
              )}
              {errorSizes && <p>Ocurrió un error al obtener las tallas</p>}
              {loadingSizes && <Spinner />}
            </div>
          ))}
                {Object.keys(selectedProducts).length === 0
          && <p className={styles.secondaryText}>No has seleccionado ningún producto</p>}
              </div>
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
