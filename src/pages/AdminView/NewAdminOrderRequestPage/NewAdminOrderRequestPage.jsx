import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './NewAdminOrderRequestPage.module.css';
import useFetch from '../../../hooks/useFetch';
import { serverHost } from '../../../config';
import useToken from '../../../hooks/useToken';
import InputSelect from '../../../components/InputSelect/InputSelect';
import ProductsSlider from '../../../components/ProductsSlider/ProductsSlider';
import ProductCatalog from '../../../components/ProductCatalog/ProductCatalog';
import SuccessNotificationPopUp from '../../../components/SuccessNotificationPopUp/SuccessNotificationPopUp';
import ErrorNotificationPopUp from '../../../components/ErrorNotificationPopUp/ErrorNotificationPopUp';
import SelectProductUnitsTable from '../../../components/SelectProductUnitsTable/SelectProductUnitsTable';
import Button from '../../../components/Button/Button';
import TextArea from '../../../components/TextArea/TextArea';
import InputDate from '../../../components/InputDate/InputDate';
import ImagePicker from '../../../components/ImagePicker/ImagePicker';
import Spinner from '../../../components/Spinner/Spinner';
import PopUp from '../../../components/PopUp/PopUp';
import usePopUp from '../../../hooks/usePopUp';

function NewAdminOrderRequestPage() {
  const token = useToken();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedProducts, setSelectedProducts] = useState({});
  const [currentProduct, setCurrentProduct] = useState('');
  const [quantities, setQuantities] = useState({});

  const [isCatalogOpen, openCatalog, closeCatalog] = usePopUp();
  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();

  const {
    callFetch: callFetchOrgs, result: resultOrgs,
  } = useFetch();

  const {
    callFetch: postRequest, result: resultPost, error: errorPost, loading: loadingPost,
  } = useFetch();

  const redirectAfterSubmit = () => navigate('/orden');

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    setForm((lastValue) => ({ ...lastValue, [field]: value }));
  };

  const handleOrgSelect = (e) => {
    handleChange(e);
    setCurrentProduct('');
    setQuantities({});
    setSelectedProducts({});
  };

  const handleImagePickerChange = (files) => {
    setForm((lastValue) => ({ ...lastValue, files }));
  };

  const clearError = (e) => {
    setErrors((lastVal) => ({ ...lastVal, [e.target.name]: null }));
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

  const deleteProduct = (id) => {
    const currentSelectedProducts = { ...selectedProducts };
    const currentQuantities = { ...quantities };
    delete currentSelectedProducts[id];
    delete currentQuantities[id];
    setQuantities(currentQuantities);
    setSelectedProducts(currentSelectedProducts);
    setCurrentProduct('');
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

  const validateProducts = () => {
    let valid = true;
    if (Object.keys(selectedProducts).length === 0) return true;
    if (Object.keys(quantities).length === 0) valid = false;
    Object.keys(quantities).forEach((product) => {
      quantities[product].forEach((entry) => {
        if (!entry.size || !entry.quantity || !entry.price) {
          valid = false;
        }
      });
    });
    if (!valid) {
      setErrors((lastVal) => ({
        ...lastVal,
        products: 'Para cada producto seleccionado se requiere talla, cantidad y precio',
      }));
      return false;
    }
    return true;
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateDescription()) return;
    if (!validateProducts()) return;

    setErrors({});

    const formCopy = { ...form };

    const descriptionValue = formCopy.description;
    if (!(descriptionValue?.length > 0)) formCopy.description = 'Productos ordenados previamente';

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
    if (!errorPost) return;
    openError();
  }, [errorPost]);

  useEffect(() => {
    if (!resultPost) return;
    openSuccess();
  }, [resultPost]);

  useEffect(() => {
    callFetchOrgs({
      uri: `${serverHost}/organization/`,
      headers: {
        authorization: token,
      },
    });
  }, []);

  return (
    <div className={styles.newAdminOrderRequestPage}>
      {isCatalogOpen
      && (
        <PopUp
          closeButton
          closeWithBackground
          close={closeCatalog}
          maxWidth={1200}
        >
          <ProductCatalog orgId={form.idClientOrganization} selectProduct={selectProduct} />
        </PopUp>
      )}
      <h1 className={styles.pageTitle}>Nueva solicitud de pedido</h1>
      <div className={styles.formContainer}>
        <div className={styles.organizationSectoin}>
          <h3 className={styles.sectionTitle}>Cliente</h3>
          <p className={styles.secondaryText}>
            Para realizar un pedido, es necesario registrarlo a una organización
          </p>
          <InputSelect
            options={resultOrgs?.result.map((org) => ({ value: org.id, title: org.name }))}
            className={`${styles.orgSelect}`}
            onChange={handleOrgSelect}
            name="idClientOrganization"
            placeholder="Selecciona una organización"
            value={form.idClientOrganization}
          />
        </div>
        {form.idClientOrganization && (
        <form className={styles.form}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Productos de pedidos anteriores</h3>

            {Object.keys(selectedProducts).length > 0 ? (
              <ProductsSlider
                products={Object.values(selectedProducts)}
                onChange={setCurrentProduct}
                onDelete={deleteProduct}
              />
            ) : (
              <p className={styles.secondaryText}>
                No se han seleccionado productos de pedidos anteriores
              </p>
            )}
            {currentProduct && (
            <SelectProductUnitsTable
              data={quantities[currentProduct]}
              onChange={handleQuantities}
              showPrice
            />
            )}
            <Button text="Agregar producto" type="button" onClick={openCatalog} name="add-products" className={styles.addProductButton} />
          </div>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Datos del pedido</h3>
            <p className={styles.secondaryText}>
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
            <p className={styles.secondaryText}>
              Adjunta imágenes de referencia, como diseños previos y medidas.
            </p>

            <div className={styles.imagePickerContainer}>
              <ImagePicker setImageFiles={handleImagePickerChange} />
            </div>
          </div>
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
          <div className={styles.buttonContainer}>
            {!loadingPost && <Button type="submit" name="send-request" text="Enviar solicitud" onClick={handleSubmit} />}
            {loadingPost && <Spinner />}
          </div>
          {errors?.products && <p className={styles.errorText}>{errors.products}</p>}
        </form>
        )}
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
        text={errorPost?.message}
        close={closeError}
        isOpen={isErrorOpen}
      />
    </div>
  );
}

export default NewAdminOrderRequestPage;
