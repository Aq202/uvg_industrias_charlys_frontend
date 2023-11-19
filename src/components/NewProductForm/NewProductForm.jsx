/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './NewProductForm.module.css';
import createProductSchema from './createProductSchema';

import useToken from '../../hooks/useToken';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useApiMultipleImages from '../../hooks/useApiMultipleImages';

import InputNumber from '../InputNumber/InputNumber';
import InputSelect from '../InputSelect/InputSelect';
import Button from '../Button/Button';
import ProductModel from '../ProductModel/ProductModel';
import SubLoadingView from '../SubLoadingView/SubLoadingView';
import useForm from '../../hooks/useForm';

function NewProductForm({ onError, onSuccess, onCancel }) {
  const {
    callFetch: getOrganizations,
    result: resultOrganizations,
    loading: loadingOrganizations,
  } = useFetch();

  const {
    callFetch: getOrders,
    result: resultOrders,
    loading: loadingOrders,
    error: errorOrders,
  } = useFetch();

  const {
    callFetch: getOrderDetails,
    result: resultOrderDetails,
    loading: loadingOrderDetails,
  } = useFetch();

  const { getMultipleApiImages, result: resultImagesProduct } = useApiMultipleImages();

  const { callFetch: getSizes, result: resultSizes, loading: loadingSizes } = useFetch();

  const {
    callFetch: postProduct,
    result: postSuccess,
    error: postError,
    loading: postLoading,
  } = useFetch();

  const {
    form, error, setData, validateForm, clearFieldError, validateField,
  } = useForm({
    schema: createProductSchema,
  });

  const token = useToken();
  const [productImages, setProductImages] = useState({});
  const [productSelected, setProductSelected] = useState(null);

  const organizations = () => {
    getOrganizations({
      uri: `${serverHost}/organization/`,
      method: 'GET',
      headers: { authorization: token },
    });
  };

  const orders = (client) => {
    getOrders({
      uri: `${serverHost}/order/finished?client=${client}`,
      method: 'GET',
      headers: { authorization: token },
    });
  };

  const orderDetails = (order) => {
    getOrderDetails({
      uri: `${serverHost}/order/${order}`,
      method: 'GET',
      headers: { authorization: token },
    });
  };

  const getProductImages = async () => {
    const media = [];
    resultOrderDetails?.detail.forEach((product) => {
      media?.push({ id: product?.id, uri: product?.media });
    });
    getMultipleApiImages(media);
  };

  const sizes = () => {
    getSizes({
      uri: `${serverHost}/generalInfo/size`,
      method: 'GET',
      headers: { authorization: token },
    });
  };

  useEffect(() => {
    organizations();
    sizes();
    setProductSelected(null);
  }, []);

  useEffect(() => {
    setData('order', null);
    clearFieldError('order');
    setProductSelected(null);

    if (!form.client) return;
    orders(form.client); // fetch orders
  }, [form.client]);

  useEffect(() => {
    setProductSelected(null);
    setData('size', null);
    setData('quantity', null);
    clearFieldError('size');
    clearFieldError('quantity');

    if (!form.order) return;
    orderDetails(form.order);
  }, [form.order, form.client]);

  useEffect(() => {
    if (!resultOrderDetails) return;
    getProductImages();
  }, [resultOrderDetails]);

  useEffect(() => {
    if (!resultImagesProduct) return;
    setProductImages(() => resultImagesProduct);
  }, [resultImagesProduct]);

  useEffect(() => {
    if (!productSelected) return;
    form.size = null;
    form.quantity = 0;
  }, [productSelected]);

  useEffect(() => {
    if (postSuccess && onSuccess) onSuccess();
  }, [postSuccess]);

  useEffect(() => {
    if (postError && onError) onError(postError.message);
  }, [postError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  const handleProductClick = (id) => {
    setData('idProduct', id);
    clearFieldError('idProduct');
    clearFieldError('size');
    clearFieldError('quantity');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateForm();
    if (errors) {
      return;
    }

    postProduct({
      uri: `${serverHost}/inventory/product`,
      method: 'POST',
      headers: { authorization: token },
      body: JSON.stringify(form),
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>Nuevo Producto</h1>
      <hr />
      <div className={styles.formGroup}>
        {(loadingOrganizations
          || loadingSizes
          || loadingOrders
          || loadingOrderDetails
          || loadingSizes
          || postLoading) && <SubLoadingView />}
        {resultOrganizations && (
          <InputSelect
            title="Organización"
            name="client"
            options={resultOrganizations?.result?.map((org) => ({
              value: org.id,
              title: org.name,
            }))}
            onChange={handleChange}
            value={form.client}
            error={error?.client}
            onFocus={(e) => clearFieldError(e.target.name)}
            onBlur={(e) => validateField(e.target.name)}
          />
        )}
        {resultOrders && form.client && (
          <InputSelect
            title="Orden"
            name="order"
            options={resultOrders?.result?.map((order) => ({ value: order.id, title: order.id }))}
            onChange={handleChange}
            value={form.order}
            error={error?.order}
            onFocus={(e) => clearFieldError(e.target.name)}
            onBlur={(e) => validateField(e.target.name)}
          />
        )}
        {form.client && errorOrders && (
          <p className={styles.errorMessage}>No hay ordenes finalizadas.</p>
        )}

        {form.order && !resultOrderDetails?.detail && !loadingOrderDetails && (
          <p className={styles.errorMessage}>No hay productos en esta orden.</p>
        )}
        {form.order && (
          <>
            <div className={styles.products}>
              {resultOrderDetails?.detail?.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className={form.idProduct === product.id ? styles.selected : ''}
                >
                  <ProductModel
                    id={product.id}
                    name={product.product}
                    type={product.type}
                    organization={product.client}
                    colors={product.colors}
                    imageUrl={productImages[product.id]}
                  />
                </div>
              ))}
            </div>

            {error?.idProduct && <p className={styles.errorMessage}>{error?.idProduct}</p>}
          </>
        )}
        {form.idProduct && (
          <div className={styles.productInfo}>
            <InputSelect
              title="Talla"
              name="size"
              options={resultSizes?.result?.map((size) => ({ value: size.id, title: size.size }))}
              onChange={handleChange}
              value={form.size}
              error={error?.size}
              onFocus={(e) => clearFieldError(e.target.name)}
              onBlur={(e) => validateField(e.target.name)}
            />
            <InputNumber
              title="Cantidad"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              error={error?.quantity}
              onFocus={(e) => clearFieldError(e.target.name)}
              onBlur={(e) => validateField(e.target.name)}
            />
          </div>
        )}
      </div>
      <div className={styles.buttons}>
        <Button text="Enviar" type="submit" name="send-new-product-inv" />
        <Button
          text="Cancelar"
          emptyRed
          type="button"
          onClick={onCancel}
          name="cancel-new-product-inv"
        />
      </div>
    </form>
  );
}

export default NewProductForm;

NewProductForm.propTypes = {
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
