import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import moment from 'moment';
import { scrollbarGray } from '@styles/scrollbar.module.css';
import Spinner from '@components/Spinner/Spinner';
import SuccessNotificationPopUp from '@components/SuccessNotificationPopUp/SuccessNotificationPopUp';
import ErrorNotificationPopUp from '@components/ErrorNotificationPopUp/ErrorNotificationPopUp';
import styles from './EditOrderPage.module.css';
import useFetch from '../../../hooks/useFetch';
import LoadingView from '../../../components/LoadingView/LoadingView';
import { serverHost } from '../../../config';
import useToken from '../../../hooks/useToken';
import TextArea from '../../../components/TextArea/TextArea';
import ProductsSlider from '../../../components/ProductsSlider/ProductsSlider';
import SelectProductUnitsTable from '../../../components/SelectProductUnitsTable/SelectProductUnitsTable';
import ProductCatalog from '../../../components/ProductCatalog/ProductCatalog';
import PopUp from '../../../components/PopUp/PopUp';
import usePopUp from '../../../hooks/usePopUp';
import Button from '../../../components/Button/Button';
import useApiMultipleImages from '../../../hooks/useApiMultipleImages';
import InputDate from '../../../components/InputDate/InputDate';
import ImagePicker from '../../../components/ImagePicker/ImagePicker';
import Thumbanils from '../../../components/Thumbnails/Thumbanils';
import randomString from '../../../helpers/randomString';

function EditOrderPage() {
  const { orderId } = useParams();
  const token = useToken();
  const [isCatalogOpen, openCatalog, closeCatalog] = usePopUp();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [selectedProducts, setSelectedProducts] = useState({});
  const [quantities, setQuantities] = useState({});
  const [currentProduct, setCurrentProduct] = useState('');
  const [imagesToRemove, setImagesToRemove] = useState([]);

  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();

  const {
    getMultipleApiImages, result: resultProductImages,
  } = useApiMultipleImages();

  const {
    getMultipleApiImages: getExtraImages, result: resultExtraImages,
  } = useApiMultipleImages();

  const {
    callFetch: fetchInfo,
    result: resultInfo,
    loading: loadingInfo,
    error: errorInfo,
  } = useFetch();

  const {
    callFetch: postChanges,
    result: resultPut,
    loading: loadingPut,
    error: errorPut,
  } = useFetch();

  const redirectToDetails = () => navigate(`/orden/${orderId}`);

  const handleImagePickerChange = (files) => {
    setForm((lastValue) => ({ ...lastValue, files }));
  };

  const removeImage = (e, id) => {
    e.preventDefault();
    setImagesToRemove((lastValue) => ([...lastValue, id]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pendiente backend: manejar la información agregada por el admin

    const formCopy = { ...form };

    if (resultInfo.clientOrganization) {
      formCopy.idClientOrganization = resultInfo.clientOrganization.id;
    }

    formCopy.idOrderRequest = orderId;

    const uri = `${serverHost}/orderRequest/`;

    const products = [];
    Object.keys(quantities).forEach((product) => {
      quantities[product].forEach((element) => {
        if (element.size !== '' && element.size !== undefined
        && element.quantity !== '' && element.quantity !== '0' && element.quantity !== undefined) {
          products.push({
            idProductModel: product,
            size: element.size,
            quantity: element.quantity,
            price: element.price,
          });
        }
      });
    });

    // guardar en formdata
    const formData = new FormData();

    // guardar imagenes
    formCopy.files?.forEach((file) => formData.append('files[]', file, file.name));
    delete formCopy.files;

    imagesToRemove?.forEach((image) => formData.append('imagesToRemove[]', image));

    // guardar otras props
    Object.entries(formCopy).forEach((item) => formData.append(item[0], item[1]));

    formData.append('products', JSON.stringify(products));

    postChanges({
      uri,
      method: 'PUT',
      headers: { authorization: token },
      body: formData,
      removeContentType: true,
    });
  };

  const getProductImages = async () => {
    if (!resultInfo.detail) return;
    const images = [];
    resultInfo.detail.forEach((product) => {
      images.push({ id: product.id, uri: product.media ? product.media[0] : null });
    });
    getMultipleApiImages(images);
  };

  const getImages = async () => {
    if (!resultInfo.media) return;
    const images = [];
    resultInfo.media.forEach((image) => {
      images.push({ id: images.length, uri: image });
    });
    getExtraImages(images);
  };

  const selectProduct = (product) => {
    if (product.id in selectedProducts) {
      closeCatalog();
      return;
    }
    setCurrentProduct(product.id);
    setSelectedProducts((prevArray) => ({ ...prevArray, [product.id]: product }));
    closeCatalog();
  };

  const setPreviousProducts = () => {
    if (!resultInfo?.detail) return;
    const requestedProducts = {};
    const requestedSizes = {};

    resultInfo.detail.forEach((element) => {
      requestedProducts[element.id] = {
        id: element.id,
        name: element.product,
        type: element.type,
        organization: resultInfo.clientOrganization.id,
        colors: element.colors,
        imageUrl: resultProductImages[element.id],
      };

      const sizesArray = [];
      element.sizes.forEach((info) => {
        sizesArray.push({ size: info.size, quantity: info.quantity, price: info.unit_price ?? 0 });
      });
      requestedSizes[element.id] = sizesArray;
    });
    setSelectedProducts(requestedProducts);
    setCurrentProduct(resultInfo.detail[0].id);
    setQuantities(requestedSizes);
  };

  const handleQuantities = (data) => {
    if (JSON.stringify(data) === '[{}]') return;

    // Create a copy of the current quantities state
    const newQuantities = { ...quantities };

    newQuantities[currentProduct] = data;

    // Check if there are no sizes left for the product and remove the product if needed
    if (Object.keys(newQuantities[currentProduct]).length === 0) {
      delete newQuantities[currentProduct];
    }

    // Update the state with the new quantities
    setQuantities(newQuantities);
  };

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    setForm((lastValue) => ({ ...lastValue, [field]: value }));
  };

  const getTotal = () => {
    let currentTotal = 0.00;
    Object.keys(quantities).forEach((product) => {
      quantities[product].forEach((element) => {
        if (element.size !== '' && element.size !== undefined
        && element.quantity !== '' && element.quantity !== '0' && element.quantity !== undefined
        && element.price !== '' && element.price !== '0' && element.price !== undefined) {
          currentTotal += +element.quantity * +element.price;
        }
      });
    });
    return currentTotal;
  };

  useEffect(() => {
    if (!resultInfo) return;

    const prevInfo = {};
    if (resultInfo.details) prevInfo.details = resultInfo.details;
    if (resultInfo.deadline) prevInfo.deadline = resultInfo.deadline;
    setForm(prevInfo);
    if (resultInfo.detail) getProductImages();
    if (resultInfo.media) getImages();
  }, [resultInfo]);

  useEffect(() => {
    if (!resultProductImages) return;
    setPreviousProducts();
  }, [resultProductImages]);

  useEffect(() => {
    if (resultPut) openSuccess();
  }, [resultPut]);

  useEffect(() => {
    if (errorPut) openError();
  }, [errorPut]);

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
      {isCatalogOpen
      && (
        <PopUp
          closeButton
          closeWithBackground
          close={closeCatalog}
          maxWidth={1200}
        >
          <ProductCatalog orgId={resultInfo?.clientOrganization.id} selectProduct={selectProduct} />
        </PopUp>
      )}
      <h1 className={styles.pageTitle}>Editar solicitud de pedido</h1>
      <div className={styles.orderInfoContainer}>
        {errorInfo && <p>Ocurrió un error al obtener la información del pedido</p>}
        {resultInfo && (
        <div className={styles.orderInfo}>

          <h3 className={styles.sectionTitle}>Información del cliente</h3>
          <div className={styles.clientInfoContainer}>

            <div>
              <strong>{resultInfo.clientOrganization ? 'Organización: ' : 'Cliente no registrado: '}</strong>
              {resultInfo.clientOrganization
                ? resultInfo.clientOrganization.name : resultInfo.temporaryClient.name}
            </div>

            <div>
              <strong>Correo electrónico: </strong>
              {resultInfo.clientOrganization
                ? resultInfo.clientOrganization.email : resultInfo.temporaryClient.email}
            </div>

            <div>
              <strong>Teléfono: </strong>
              {resultInfo.clientOrganization
                ? resultInfo.clientOrganization.phone : resultInfo.temporaryClient.phone}
            </div>

          </div>
          <h3 className={styles.sectionTitle}>Información de la solicitud</h3>
          <div className={styles.headerContainer}>
            <p>
              <strong>Código de solicitud: </strong>
              {resultInfo.id}
            </p>
            <p>
              <strong>Fecha solicitada: </strong>
              {moment(resultInfo.datePlaced).format('DD-MM-YYYY')}
            </p>
          </div>

          <div className={styles.details}>
            <strong>Detalles: </strong>
            <p>{resultInfo.description}</p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Archivos adjuntos</h3>
            <div className={`${styles.divFile} ${scrollbarGray}`}>
              {resultExtraImages ? (
                <div className={styles.imageViewerContainer}>
                  {Object.entries(resultExtraImages).map((image) => (
                    !imagesToRemove.includes(image[1])
                    && (
                      <Thumbanils
                        img={image[1]}
                        id={image[1]}
                        key={randomString(10)}
                        onDeleteClick={removeImage}
                        className={styles.imageThumbnail}
                      />
                    )
                  ))}
                </div>
              ) : (
                <p className={styles.noImagesMessage}>No hay recursos multimedia adjuntos.</p>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Detalles adicionales</h3>
            <TextArea
              name="details"
              value={form.details}
              onChange={handleChange}
            />
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Imágenes adicionales</h3>
            <ImagePicker setImageFiles={handleImagePickerChange} />
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Productos a realizar</h3>
            {resultInfo?.clientOrganization ? (
              <>
                <div className={styles.selectedProductsGrid}>
                  {Object.keys(selectedProducts).length > 0
          && (
          <ProductsSlider
            products={Object.values(selectedProducts)}
            onChange={setCurrentProduct}
          />
          )}
                  {Object.keys(selectedProducts).length === 0
          && <p className={styles.secondaryText}>No se ha solicitado ningún producto registrado</p>}
                </div>
                {currentProduct && (
                <SelectProductUnitsTable
                  data={quantities[currentProduct]}
                  onChange={handleQuantities}
                  showPrice
                />
                )}
                <Button text="Agregar producto" type="submit" onClick={openCatalog} name="add-products" className={styles.addProductButton} />
              </>
            ) : 'El cliente no está registrado en una organización, no hay registro de productos solicitados anteriormente'}
          </div>
        </div>
        )}

        <div className={styles.adminOptionsSection}>
          <div>
            <h3 className={styles.sectionTitle}>Fecha de entrega</h3>
            <InputDate
              name="deadline"
              value={form.deadline ? form.deadline.slice(0, 10) : ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <h3 className={styles.sectionTitle}>Cotización inicial</h3>
            <p>{`Q.${getTotal().toFixed(2)}`}</p>
          </div>
        </div>
        <div className={styles.buttonsContainer}>
          {!loadingPut && (
            <>
              <Button className={styles.discardChangesButton} type="submit" text="Regresar" name="goBack" secondary onClick={redirectToDetails} />
              <Button className={styles.saveChangesButton} type="submit" text="Guardar cambios" name="saveChanges" onClick={(e) => handleSubmit(e)} />
            </>
          )}
          {loadingPut && <Spinner />}
        </div>
      </div>
      <SuccessNotificationPopUp
        title="Listo"
        text="La solicitud de pedido fue actualizada correctamente"
        close={closeSuccess}
        isOpen={isSuccessOpen}
        callback={redirectToDetails}
      />
      <ErrorNotificationPopUp
        title="Error"
        text={errorPut?.message}
        close={closeError}
        isOpen={isErrorOpen}
      />
      {loadingInfo && <LoadingView />}
    </div>
  );
}

export default EditOrderPage;
