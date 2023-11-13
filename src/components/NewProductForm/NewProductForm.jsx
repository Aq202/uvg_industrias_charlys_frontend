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

function NewProductForm({
  onError, onSuccess, onCancel,
}) {
  const {
    callFetch: getOrganizations,
    result: resultOrganizations,
    loading: loadingOrganizations,
  } = useFetch();

  const {
    callFetch: getOrders,
    result: resultOrders,
    loading: loadingOrders,
  } = useFetch();

  const {
    callFetch: getOrderDetails,
    result: resultOrderDetails,
    loading: loadingOrderDetails,
  } = useFetch();

  const {
    getMultipleApiImages,
    result: resultImagesProduct,
  } = useApiMultipleImages();

  const {
    callFetch: getSizes,
    result: resultSizes,
    loading: loadingSizes,
  } = useFetch();

  const {
    callFetch: postProduct,
  } = useFetch();

  const token = useToken();
  const [form, setForm] = useState({});
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
    if (!form.client) return;
    orders(form.client);
    form.order = null;
    setProductSelected(null);
  }, [form.client]);

  useEffect(() => {
    if (!form.order) return;
    orderDetails(form.order);
    setProductSelected(null);
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

  const validateForm = async () => {
    try {
      await createProductSchema.validate(form, { abortEarly: false });
      return null;
    } catch (err) {
      return err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateForm();
    if (errors) {
      onError(errors);
      return;
    }

    postProduct({
      uri: `${serverHost}/inventory/product`,
      method: 'POST',
      headers: { authorization: token },
      body: JSON.stringify(form),
    });

    onSuccess();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>Nuevo Producto</h1>
      <hr />
      <div className={styles.formGroup}>
        {(loadingOrganizations || loadingSizes) && <SubLoadingView />}
        {resultOrganizations && (
          <InputSelect
            title="Organización"
            name="client"
            options={
              resultOrganizations?.result?.map((org) => ({ value: org.id, title: org.name }))
            }
            onChange={(e) => setForm({ ...form, client: e.target.value })}
            value={form.client}
          />
        )}
        {loadingOrders && <SubLoadingView />}
        {!loadingOrders && form.client && (
        <InputSelect
          title="Orden"
          name="order"
          options={
              resultOrders?.result?.map((order) => ({ value: order.id, title: order.id }))
            }
          onChange={(e) => setForm({ ...form, order: e.target.value })}
          value={form.order}
        />
        )}
        {loadingOrderDetails && <SubLoadingView />}
        {resultImagesProduct?.detail?.length === 0 && <p>No hay productos en esta orden</p>}
        {form.order && (
          <div className={styles.products}>
            {resultOrderDetails?.detail?.map((product) => (
              <div
                key={product.id}
                onClick={() => setProductSelected(product.id)}
                className={productSelected === product.id ? styles.selected : ''}
              >
                <ProductModel
                  id={product.id}
                  name={product.product}
                  type={product.description}
                  organization={product.client}
                  colors={product.colors}
                  imageUrl={productImages[product.id]}
                />
              </div>
            ))}

          </div>
        )}
        { productSelected && (
        <div className={styles.productInfo}>
          {loadingSizes && <SubLoadingView />}
          <InputSelect
            title="Talla"
            name="size"
            options={
                resultSizes?.map((size) => ({ value: size.id, title: size.size }))
            }
            onChange={(e) => setForm({ ...form, size: e.target.value })}
            value={form.size}
          />
          <InputNumber
            title="Cantidad"
            name="quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
        </div>
        )}
      </div>
      <div className={styles.buttons}>
        <Button text="Enviar" type="submit" />
        <Button text="Cancelar" emptyRed type="button" onClick={onCancel} />
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
