import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { serverHost } from '@/config';
import Spinner from '@components/Spinner';
import { button, aqua } from '@styles/buttons.module.css';
import styles from './InventoryDetails.module.css';
import useFetch from '../../hooks/useFetch';
import InputText from '../InputText/InputText';
import InputNumber from '../InputNumber/InputNumber';
import TextArea from '../TextArea/TextArea';
import useToken from '../../hooks/useToken';

function InventoryDetails({ itemId, onSuccess }) {
  const [info, setInfo] = useState({});
  const [errors, setErrors] = useState({});
  const token = useToken();
  const {
    callFetch, result, error, loading,
  } = useFetch();
  const {
    callFetch: callFetch2, result: result2, error: error2, loading: loading2,
  } = useFetch();
  useEffect(() => {
    if (!result) return;
    // eslint-disable-next-line no-console
    console.log(result);
    setInfo(() => (result[0]));
  }, [result]);

  useEffect(() => {
    if (!result) return;
    // eslint-disable-next-line no-console
    console.log(result);
    onSuccess();
  }, [result2]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(error);
  }, [error]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(error);
  }, [error2]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(loading);
  }, [loading]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(loading);
  }, [loading2]);

  useEffect(() => {
    const uri = `${serverHost}/inventory/id?search=${itemId}`;
    callFetch({
      uri,
      method: 'GET',
      headers: { Authorization: token },
      removeContentType: true,
    });
  }, []);

  const clearError = (e) => {
    setErrors((lastVal) => ({ ...lastVal, [e.target.name]: null }));
  };

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    setInfo((lastValue) => ({ ...lastValue, [field]: value }));
  };

  const validateDescription = () => {
    const value = info.description;
    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, description: 'Se necesita una descripción' }));
      return false;
    }

    return true;
  };

  const validateColor = () => {
    const value = info.color;
    if (value !== null && !(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, color: 'Se necesita un color' }));
      return false;
    }

    return true;
  };

  const validateSize = () => {
    const value = info.size;
    if (value !== null && !(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, size: 'Se necesita una talla' }));
      return false;
    }

    return true;
  };

  const validateQuantity = () => {
    const value = info.quantity;
    if (!(value > 0)) {
      setErrors((lastVal) => ({ ...lastVal, quantity: 'Se necesita una cantidad' }));
      return false;
    }

    return true;
  };

  const validateSupplier = () => {
    const value = info.supplier;
    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, size: 'Se necesita un proveedor' }));
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    if (!validateDescription()) hasError = true;
    if (!validateColor()) hasError = true;
    if (!validateQuantity()) hasError = true;
    if (!validateSize()) hasError = true;
    if (!validateSize()) hasError = true;
    if (!validateSupplier()) hasError = true;
    if (hasError) return;

    const uri = `${serverHost}/inventory/update`;

    let bodyInfo;

    if (info.category_id[0] === 'M') {
      bodyInfo = {
        material: info.category_id,
        fabric: null,
        product: null,
        description: info.description,
        color: info.color,
        quantity: info.quantity,
        supplier: info.supplier,
        details: info.details,
      };
    } else if (info.category_id[0] === 'F') {
      bodyInfo = {
        material: null,
        fabric: info.category_id,
        product: null,
        description: info.description,
        color: info.color,
        quantity: info.quantity,
        supplier: info.supplier,
        details: info.details,
      };
    } else if (info.category_id[0] === 'P') {
      bodyInfo = {
        material: null,
        fabric: null,
        product: info.category_id,
        description: info.description,
        color: info.color,
        quantity: info.quantity,
        supplier: info.supplier,
        details: info.details,
      };
    }

    callFetch2({
      uri,
      method: 'PUT',
      body: JSON.stringify(bodyInfo),
      headers: { Authorization: token },
    });
  };

  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.containerTitle}>Descripción del artículo</h1>
      {loading && <Spinner />}
      {!loading && !error && (
      <div className={styles.detailsContainer}>
        <div className={styles.detail}>
          <InputText
            name="description"
            title="Descripción"
            value={info.description}
            error={errors.description}
            onChange={handleChange}
            onBlur={validateDescription}
            onFocus={clearError}
          />
        </div>
        {info.color !== null && (
          <div className={styles.detail}>
            <InputText
              name="color"
              title="Color"
              value={info.color}
              error={errors.color}
              onChange={handleChange}
              onBlur={validateColor}
              onFocus={clearError}
            />
          </div>
        )}
        {info.size !== null && (
          <div className={styles.detail}>
            <InputText
              name="size"
              title="Talla"
              value={info.size}
              error={errors.size}
              onChange={handleChange}
              onBlur={validateSize}
              onFocus={clearError}
            />
          </div>
        )}
        <div className={styles.detail}>
          <InputNumber
            name="quantity"
            title="Cantidad"
            value={info.quantity}
            measureUnit={info.measurement_unit}
            error={errors.quantity}
            onChange={handleChange}
            step="1"
            onBlur={validateQuantity}
            onFocus={clearError}
          />
        </div>
        <div className={styles.detail}>
          <InputText
            name="supplier"
            title="Proveedor"
            value={info.supplier}
            error={errors.supplier}
            onChange={handleChange}
            onBlur={validateSupplier}
            onFocus={clearError}
          />
        </div>
        <div className={styles.detail}>
          <TextArea
            name="details"
            title="Detalles"
            value={info.details}
            error={errors.details}
            onChange={handleChange}
            onFocus={clearError}
          />
        </div>
      </div>
      )}
      <div className={styles.buttonContainer}>
        {!loading2 && (
        <button
          onClick={handleSubmit}
          type="submit"
          className={`${button} ${aqua}`}
        >
          Guardar cambios
        </button>
        )}
        {loading && <Spinner />}
      </div>
      {error && (
      <div>
        <p>Ocurrió un error al buscar información de este artículo</p>
      </div>
      )}
    </div>
  );
}

InventoryDetails.propTypes = {
  itemId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default InventoryDetails;
