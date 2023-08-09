/* eslint-disable no-debugger */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './NewMaterialForm.module.css';
import InputText from '../InputText';
import InputSelect from '../InputSelect/InputSelect';
import InputNumber from '../InputNumber/InputNumber';
import TextArea from '../TextArea/TextArea';
import Button from '../Button/Button';
import Spinner from '../Spinner/Spinner';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import parseErrorObject from '../../helpers/parseErrorObject';
import createMaterialSchema from './createMaterialSchema';

function NewMaterialForm({
  id, onError, onSuccess, onCancel,
}) {
  const [form, setForm] = useState({});
  const [error, setError] = useState({});
  const {
    callFetch: fetchTypes,
    result: resultTypes,
    loading: loadingTypes,
    error: errorTypes,
  } = useFetch();
  const token = useToken();

  const {
    callFetch: fetchResult, result, loading: actionLoading, error: actionError,
  } = useFetch();

  const {
    callFetch: fetchPrevData,
    result: resultPrevData,
    loading: loadingPrevData,
    error: errorPrevData,
  } = useFetch();

  useEffect(() => {
    if (!token || resultTypes) return;
    // llamar a los tipos de material
    fetchTypes({ uri: `${serverHost}/inventory/materialType`, headers: { authorization: token } });
  }, [token]);

  useEffect(() => {
    if (!errorTypes && !actionError && !errorPrevData) return;
    // mandar mensaje de error
    onError(
      errorTypes?.message ?? actionError?.message ?? errorPrevData?.message ?? 'Ocurrió un error.',
    );
  }, [errorTypes, actionError, errorPrevData]);

  useEffect(() => {
    // activar callback cuando la acción es exitosa
    if (!result) return;
    onSuccess(
      id
        ? 'El artículo se ha actualizado exitosamente.'
        : 'Se ha creado el artículo de forma exitosa.',
    );
  }, [result]);

  useEffect(() => {
    if (!id) return;
    const uri = `${serverHost}/inventory?id=${id}`;
    fetchPrevData({ uri, headers: { authorization: token } });
  }, [id]);

  useEffect(() => {
    if (!resultPrevData) return;
    const data = resultPrevData[0];

    setForm({ ...data, name: data.materialName, type: data.idMaterialType });
  }, [resultPrevData]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = async () => {
    try {
      await createMaterialSchema.validate(form, { abortEarly: false });
      return null;
    } catch (err) {
      return parseErrorObject(err);
    }
  };

  const validateField = async (e) => {
    const { name } = e.target;
    const errors = await validateForm();
    if (errors != null) {
      setError((lastErrors) => ({
        ...lastErrors,
        [name]: errors[name],
      }));
    }
  };

  const clearFieldError = (e) => {
    const { name } = e.target;
    setError((lastErrors) => ({
      ...lastErrors,
      [name]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateForm();
    if (errors) {
      setError(errors);
      return;
    }

    // Parsear formulario
    const formCopy = { ...form };
    if (!(formCopy.supplier?.length > 0)) delete formCopy.supplier;
    if (!(formCopy.details?.length > 0)) delete formCopy.details;
    if (id) formCopy.inventoryId = id;

    // Enviar formulario
    const uri = id ? `${serverHost}/inventory/updateMaterial` : `${serverHost}/inventory/material`;
    const method = id ? 'PUT' : 'POST';
    fetchResult({
      uri,
      method,
      headers: { authorization: token },
      body: JSON.stringify(formCopy),
    });

    setError({});
  };

  return (
    <form className={styles.newMaterialForm} onSubmit={handleSubmit}>
      <h1>{!id ? 'Nuevo material' : 'Actualizar material'}</h1>
      <hr />

      <div className={styles.formContainer}>
        <InputText
          title="Nombre:"
          name="name"
          onChange={handleChange}
          value={form.name}
          error={error.name}
          onBlur={validateField}
          onFocus={clearFieldError}
        />
        <InputSelect
          title="Tipo de material:"
          name="type"
          options={resultTypes?.result.map((item) => ({ value: item.id, title: item.name }))}
          error={error.type}
          onChange={handleChange}
          onBlur={validateField}
          onFocus={clearFieldError}
          value={form.type}
        />

        <InputText
          title="Proveedor:"
          name="supplier"
          onChange={handleChange}
          value={form.supplier}
          error={error.supplier}
          onBlur={validateField}
          onFocus={clearFieldError}
        />
        <div className={styles.quantityContainer}>
          <InputNumber
            title="Cantidad:"
            name="quantity"
            onChange={handleChange}
            value={form.quantity}
            min={0}
            step={1}
            error={error.quantity}
            onBlur={validateField}
            onFocus={clearFieldError}
          />
          <InputText
            title="Unidad de medida:"
            name="measurementUnit"
            onChange={handleChange}
            value={form.measurementUnit}
            error={error.measurementUnit}
            onBlur={validateField}
            onFocus={clearFieldError}
          />
        </div>

        <TextArea
          title="Detalles:"
          className={styles.textarea}
          name="details"
          onChange={handleChange}
          value={form.details}
          error={error.details}
          onBlur={validateField}
          onFocus={clearFieldError}
        />
      </div>

      <div className={styles.bottomItemsContainer}>
        {actionLoading && <Spinner />}
        {!actionLoading && !result && (
          <>
            <Button text="Enviar" type="submit" name="send-form-button" />
            <Button text="Cancelar" emptyRed type="button" onClick={onCancel} name="cancel-form-button" />
          </>
        )}
      </div>

      {(loadingTypes || loadingPrevData) && (
        <div className={styles.loadingContainer}>
          <Spinner className={styles.spinner} />
        </div>
      )}
    </form>
  );
}

export default NewMaterialForm;

NewMaterialForm.propTypes = {
  id: PropTypes.string,
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

NewMaterialForm.defaultProps = {
  id: null,
};
