/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './NewCustomerOrderRequestPage.module.css';
import Button from '../../../components/Button/Button';
import PopUp from '../../../components/PopUp/PopUp';
import usePopUp from '../../../hooks/usePopUp';
import useFetch from '../../../hooks/useFetch';
import { serverHost } from '../../../config';
import useToken from '../../../hooks/useToken';
import getTokenPayload from '../../../helpers/getTokenPayload';
import Spinner from '../../../components/Spinner/Spinner';
import TextArea from '../../../components/TextArea/TextArea';
import ImagePicker from '../../../components/ImagePicker/ImagePicker';
import SuccessNotificationPopUp from '../../../components/SuccessNotificationPopUp/SuccessNotificationPopUp';
import ErrorNotificationPopUp from '../../../components/ErrorNotificationPopUp/ErrorNotificationPopUp';
import ProductCatalog from '../../../components/ProductCatalog/ProductCatalog';
import ProductsSlider from '../../../components/ProductsSlider/ProductsSlider';
import SelectProductUnitsTable from '../../../components/SelectProductUnitsTable/SelectProductUnitsTable';

function NewCustomerOrderRequestPage() {
  const token = useToken();
  const navigate = useNavigate();
  const [isCatalogOpen, openCatalog, closeCatalog] = usePopUp();
  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();
  const {
    callFetch: postRequest, result: resultPost, error: errorPost, loading: loadingPost,
  } = useFetch();
  const [selectedProducts, setSelectedProducts] = useState({});
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [quantities, setQuantities] = useState({});
  const [orgId, setOrgId] = useState('');
  const [currentProduct, setCurrentProduct] = useState('');

  const redirectAfterSubmit = () => navigate(`/solicitudOrden/${resultPost?.id ?? ''}`);

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    setForm((lastValue) => ({ ...lastValue, [field]: value }));
  };

  const handleImagePickerChange = (files) => {
    setForm((lastValue) => ({ ...lastValue, files }));
  };

  const selectProduct = (product) => {
    if (product.id in selectedProducts) {
      closeCatalog();
      return;
    }
    setSelectedProducts((prevArray) => ({ ...prevArray, [product.id]: product }));
    setCurrentProduct(product.id);
    closeCatalog();
  };

  const validateDescription = () => {
    const value = form.description;

    if (!(value?.length > 0) && !(Object.keys(selectedProducts).length > 0)) {
      setErrors((lastVal) => ({
        ...lastVal,
        description: 'Si se trata de un producto nuevo, se necesitan detalles para iniciar el pedido',
      }));
      return false;
    }

    return true;
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

  const clearError = (e) => {
    setErrors((lastVal) => ({ ...lastVal, [e.target.name]: null }));
  };

  const deleteProduct = (id) => {
    const currentSelectedProducts = { ...selectedProducts };
    const currentQuantities = { ...quantities };
    delete currentSelectedProducts[id];
    delete currentQuantities[id];
    setQuantities(currentQuantities);
    setSelectedProducts(currentSelectedProducts);
    setCurrentProduct('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateDescription()) return;

    const formCopy = { ...form };

    const descriptionValue = formCopy.description;
    if (!(descriptionValue?.length > 0)) formCopy.description = 'Productos ordenados previamente';

    formCopy.idClientOrganization = orgId;

    const uri = `${serverHost}/orderRequest/client`;

    const products = [];
    Object.keys(quantities).forEach((product) => {
      quantities[product].forEach((element) => {
        if (element.size !== '' && element.size !== undefined
        && element.quantity !== '' && element.quantity !== '0' && element.quantity !== undefined) {
          products.push({
            idProductModel: product,
            size: element.size,
            quantity: element.quantity,
          });
        }
      });
    });

    // guardar en formdata
    const formData = new FormData();

    // guardar imagenes
    formCopy.files?.forEach((file) => formData.append('files[]', file, file.name));
    delete formCopy.files;

    // guardar otras props
    Object.entries(formCopy).forEach((item) => formData.append(item[0], item[1]));

    // products.forEach((product) => formData.append('products[]', product));

    formData.append('products', JSON.stringify(products));

    postRequest({
      uri,
      method: 'POST',
      headers: { authorization: token },
      body: formData,
      removeContentType: true,
    });
  };

  useEffect(() => {
  }, [currentProduct]);

  useEffect(() => {
    if (!token) return;
    const tokenPayload = getTokenPayload(token);
    setOrgId(() => tokenPayload.clientOrganizationId);
  }, [token]);

  useEffect(() => {
    if (!errorPost) return;
    openError();
  }, [errorPost]);

  useEffect(() => {
    if (!resultPost) return;
    openSuccess();
  }, [resultPost]);

  return (
    <div className={styles.newCustomerOrderRequest}>
      {isCatalogOpen
      && (
        <PopUp
          closeButton
          closeWithBackground
          close={closeCatalog}
          maxWidth={1200}
        >
          <ProductCatalog orgId={orgId} selectProduct={selectProduct} />
        </PopUp>
      )}
      <h1 className={styles.pageTitle}>Nuevo pedido</h1>
      <div className={styles.formContainer}>
        <h3 className={styles.sectionTitle}>Elige productos que ya hayas solicitado</h3>
        <div className={styles.selectedProductsGrid}>
          {Object.keys(selectedProducts).length > 0
          && (
          <ProductsSlider
            products={Object.values(selectedProducts)}
            onChange={setCurrentProduct}
            onDelete={deleteProduct}
          />
          )}
          {Object.keys(selectedProducts).length === 0
          && <p className={styles.secondaryText}>No has seleccionado ningún producto</p>}
        </div>
        {currentProduct && (
        <SelectProductUnitsTable
          data={quantities[currentProduct]}
          onChange={handleQuantities}
        />
        )}
        <Button text="Agregar producto" type="submit" onClick={openCatalog} name="add-products" className={styles.addProductButton} />
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Datos del pedido</h3>
          <p className={styles.inputDescription}>
            Incluye detalles como tipo de producto, cantidad, tipo de tela, color, tallas
            requeridas, etc.
          </p>
          <TextArea
            name="description"
            className={styles.detailsTextArea}
            onChange={handleChange}
            value={form.description}
            error={errors.description}
            onBlur={validateDescription}
            onFocus={clearError}
          />
        </div>
        <div className={styles.section}>
          <p className={styles.inputDescription}>
            Adjunta imágenes de referencia, como diseños previos y medidas.
          </p>

          <div className={styles.imagePickerContainer}>
            <ImagePicker setImageFiles={handleImagePickerChange} />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          {!loadingPost && <Button type="submit" name="send-request" text="Enviar solicitud" onClick={handleSubmit} />}
          {loadingPost && <Spinner />}
        </div>
      </div>
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

export default NewCustomerOrderRequestPage;
