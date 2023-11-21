import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InputText from '@components/InputText/InputText';
import Button from '@components/Button/Button';
import Spinner from '@components/Spinner/Spinner';
import useFetch from '@hooks/useFetch';
import useToken from '@hooks/useToken';
import parseErrorObject from '@helpers/parseErrorObject';
import { serverHost } from '@/config';
import styles from './NewProductTypeForm.module.css';
import createMemberSchema from './createTypeSchema';

function NewProductTypeForm({
  onError, onSuccess, onCancel,
}) {
  const [form, setForm] = useState({});
  const [error, setError] = useState({});
  const token = useToken();

  const {
    callFetch: fetchResult, result, loading: actionLoading, error: actionError,
  } = useFetch();

  useEffect(() => {
    if (!actionError) return;
    // mandar mensaje de error
    if (onError) {
      onError(
        actionError?.message ?? 'Ocurrió un error.',
      );
    }
  }, [actionError]);

  useEffect(() => {
    // activar callback cuando la acción es exitosa
    if (!result) return;
    if (onSuccess) onSuccess('Se ha agregado el tipo de producto de forma exitosa.');
  }, [result]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = async () => {
    try {
      await createMemberSchema.validate(form, { abortEarly: false });
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

    // Enviar formulario
    const uri = `${serverHost}/product/type`;
    const method = 'POST';
    fetchResult({
      uri,
      method,
      headers: { authorization: token },
      body: JSON.stringify(form),
      parse: false,
    });

    setError({});
  };
  return (
    <form className={styles.newTypeForm} onSubmit={handleSubmit}>
      <h1>Nuevo tipo de producto</h1>
      <hr />

      <div className={styles.formContainer}>
        <InputText
          title="Tipo de producto"
          name="name"
          onChange={handleChange}
          value={form.name}
          error={error?.name}
          onBlur={validateField}
          onFocus={clearFieldError}
        />
      </div>

      <div className={styles.bottomItemsContainer}>
        {actionLoading && <Spinner />}
        {!actionLoading && !result && (
          <>
            <Button text="Enviar" type="submit" name="postSize" />
            <Button text="Cancelar" emptyRed type="button" onClick={onCancel} name="cancelPost" />
          </>
        )}
      </div>
    </form>
  );
}

export default NewProductTypeForm;

NewProductTypeForm.propTypes = {
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
