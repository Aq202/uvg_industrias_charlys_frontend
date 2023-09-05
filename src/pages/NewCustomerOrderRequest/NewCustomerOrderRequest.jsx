/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import styles from './NewCustomerOrderRequest.module.css';
import ProductModel from '../../components/ProductModel/ProductModel';
import Button from '../../components/Button/Button';
import PopUp from '../../components/PopUp/PopUp';
import usePopUp from '../../hooks/usePopUp';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import getTokenPayload from '../../helpers/getTokenPayload';
import useApiMultipleImages from '../../hooks/useApiMultipleImages';
import Spinner from '../../components/Spinner/Spinner';
import TextArea from '../../components/TextArea/TextArea';
import InputNumber from '../../components/InputNumber/InputNumber';
import ImagePicker from '../../components/ImagePicker/ImagePicker';

function NewCustomerOrderRequest() {
  const token = useToken();
  const {
    getMultipleApiImages, result: resultImages,
  } = useApiMultipleImages();
  const [isCatalogOpen, openCatalog, closeCatalog] = usePopUp();
  const {
    callFetch: getCatalog, result: resultCatalog, error: errorCatalog, loading: loadingCatalog,
  } = useFetch();
  const {
    callFetch: getSizes, result: resultSizes, error: errorSizes, loading: loadingSizes,
  } = useFetch();
  const {
    callFetch: postRequest, result: resultPost, error: errorPost, loading: loadingPost,
  } = useFetch();
  const [sizes, setSizes] = useState([]);
  const [previousProducts, setPreviousProducts] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [selectedProducts, setSelectedProducts] = useState({});
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [quantities, setQuantities] = useState({});
  const [orgId, setOrgId] = useState('');

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
    closeCatalog();
  };

  const getPreviousProducts = async () => {
    getCatalog({
      uri: `${serverHost}/product/model/by-organization/${orgId}`,
      headers: { authorization: token },
      method: 'POST',
    });
  };

  const getProductImages = async () => {
    const images = [];
    resultCatalog.forEach((product) => {
      images.push({ id: product.id, uri: product.media[0] });
    });
    getMultipleApiImages(images);
  };

  const getAllSizes = async () => {
    getSizes({
      uri: `${serverHost}/generalInfo/size`,
      headers: { authorization: token },
    });
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

  const clearError = (e) => {
    setErrors((lastVal) => ({ ...lastVal, [e.target.name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateDescription()) return;

    const descriptionValue = form.description;
    if (!(descriptionValue?.length > 0)) form.description = 'Productos ordenados previamente';

    form.idClientOrganization = orgId;

    const uri = `${serverHost}/orderRequest/client`;

    const products = [];
    Object.keys(quantities).forEach((product) => {
      Object.keys(quantities[product]).forEach((size) => {
        products.push({ idProductModel: product, size, quantity: quantities[product][size] });
      });
    });

    // guardar en formdata
    const formData = new FormData();

    // guardar imagenes
    form.files?.forEach((file) => formData.append('files[]', file, file.name));
    delete form.files;

    // guardar otras props
    Object.entries(form).forEach((item) => formData.append(item[0], item[1]));

    // products.forEach((product) => formData.append('products[]', product));

    formData.append('products', JSON.stringify(products));

    console.log(formData.getAll('products'));

    postRequest({
      uri,
      method: 'POST',
      headers: { authorization: token },
      body: formData,
      removeContentType: true,
    });
  };

  useEffect(() => {
    if (!orgId) return;
    getPreviousProducts();
    getAllSizes();
  }, [orgId]);

  useEffect(() => {
    if (!token) return;
    console.log('Aquí obtiene el payload');
    const tokenPayload = getTokenPayload(token);
    setOrgId(() => tokenPayload.clientOrganizationId);
  }, [token]);

  useEffect(() => {
    if (!resultCatalog) return;
    setPreviousProducts(() => resultCatalog);
    getProductImages();
  }, [resultCatalog]);

  useEffect(() => {
    if (!resultImages) return;
    setProductImages(() => resultImages);
  }, [resultImages]);

  useEffect(() => {
    console.log(selectedProducts);
  }, [selectedProducts]);

  useEffect(() => {
    console.log(resultSizes);
    if (!resultSizes) return;
    console.log(sizes);
    setSizes(() => resultSizes);
  }, [resultSizes]);

  useEffect(() => {
    if (!quantities) return;
    console.log(quantities);
  }, [quantities]);

  useEffect(() => {
    if (!errorPost) return;
    console.log(errorPost);
  }, [errorPost]);

  useEffect(() => {
    if (!resultPost) return;
    console.log(resultPost);
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
      <h1 className={styles.pageTitle}>Nuevo pedido</h1>
      <div className={styles.formContainer}>
        <h3 className={styles.sectionTitle}>Elige productos que ya hayas solicitado</h3>
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
                <div className={styles.tableRow}>
                  <h3 className={styles.tableItem}>Talla</h3>
                  <h3 className={styles.tableItem}>Cantidad</h3>
                </div>
                <div className={styles.tableRow}>
                  <h3 className={styles.tableItem}>Talla</h3>
                  <h3 className={styles.tableItem}>Cantidad</h3>
                </div>
                <div className={styles.tableRow}>
                  <h3 className={styles.tableItem}>Talla</h3>
                  <h3 className={styles.tableItem}>Cantidad</h3>
                </div>
                  {sizes?.length > 0 && sizes.map((element) => (
                    <div className={styles.tableRow}>
                      <p className={styles.tableItem}>{element.size}</p>
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
        <Button text="Agregar producto" type="submit" onClick={openCatalog} name="add-products" />
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
    </div>
  );
}

export default NewCustomerOrderRequest;
