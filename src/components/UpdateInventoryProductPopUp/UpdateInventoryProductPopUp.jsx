import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './UpdateInventoryProductPopUp.module.css';
import PopUp from '../PopUp/PopUp';
import ProductModel from '../ProductModel/ProductModel';
import InputNumber from '../InputNumber/InputNumber';
import Button from '../Button/Button';
import useForm from '../../hooks/useForm';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import usePopUp from '../../hooks/usePopUp';
import SuccessNotificationPopUp from '../SuccessNotificationPopUp/SuccessNotificationPopUp';
import ErrorNotificationPopUp from '../ErrorNotificationPopUp/ErrorNotificationPopUp';
import SubLoadingView from '../SubLoadingView/SubLoadingView';
import quantitySchema from './quantitySchema';

function UpdateInventoryProductPopUp({
  isOpen, close, product, size, defaultQuantity, onSuccess,
}) {
  const {
    form, setData, error, clearFieldError, validateField, validateForm,
  } = useForm({ schema: quantitySchema });

  const {
    callFetch: updateFetch, result, error: updateError, loading,
  } = useFetch();

  const token = useToken();

  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();

  useEffect(() => {
    setData('quantity', defaultQuantity);
  }, [defaultQuantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = await validateForm();
    if (err) return;

    const body = {
      idProduct: product?.id,
      size,
      quantity: form.quantity,
    };

    updateFetch({
      uri: `${serverHost}/inventory/updateProduct`,
      method: 'PUT',
      headers: { authorization: token },
      body: JSON.stringify(body),
    });
  };

  const handleSuccessClose = () => {
    if (onSuccess) {
      onSuccess();
    }
    close();
  };

  useEffect(() => {
    if (result) openSuccess();
  }, [result]);

  useEffect(() => {
    if (updateError) openError();
  }, [updateError]);

  return (
    <>
      {isOpen && (
      <PopUp close={close} closeWithBackground={false} closeButton={false}>
        <div className={styles.container}>
          <h2 className={styles.title}>Editar existencias de producto</h2>
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <ProductModel
              url="#"
              name={product.name}
              imageUrl={product.imageUrl}
              type={product.type}
              organization={product.organization}
              colors={product.colors}
              className={styles.productModel}
            />

            <div className={styles.dataContainer}>
              <p className={styles.dataRow}>
                <span>Talla: </span>
                {size}
              </p>

              <InputNumber
                title="Cantidad"
                value={form.quantity}
                onChange={(e) => setData('quantity', e.target.value)}
                onFocus={() => clearFieldError('quantity')}
                onBlur={() => validateField('quantity')}
                error={error?.quantity}
                step={1}
                min={0}

              />

              <div className={styles.buttons}>
                <Button text="Enviar" type="submit" name="update-product-inv" />
                <Button
                  text="Cancelar"
                  emptyRed
                  type="button"
                  name="cancel-update-product-inv"
                  onClick={close}
                />
              </div>
            </div>
          </form>

          {loading && <SubLoadingView />}
        </div>
      </PopUp>
      )}
      <SuccessNotificationPopUp
        close={closeSuccess}
        isOpen={isSuccessOpen}
        text="El arctículo de inventario fue actualizado correctamente."
        callback={handleSuccessClose}
      />

      <ErrorNotificationPopUp close={closeError} isOpen={isErrorOpen} text={updateError?.message} />
    </>
  );
}

export default UpdateInventoryProductPopUp;

UpdateInventoryProductPopUp.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    url: PropTypes.string,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    type: PropTypes.string.isRequired,
    organization: PropTypes.string,
    colors: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        r: PropTypes.number.isRequired,
        g: PropTypes.number.isRequired,
        b: PropTypes.number.isRequired,
      }),
    ),
  }).isRequired,
  size: PropTypes.string.isRequired,
  defaultQuantity: PropTypes.number.isRequired,
  onSuccess: PropTypes.func,
};

UpdateInventoryProductPopUp.defaultProps = {
  isOpen: false,
  close: null,
  onSuccess: null,
};
