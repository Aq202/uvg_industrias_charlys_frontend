import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './NewSizeForm.module.css';
import InputText from '../InputText/InputText';
import Button from '../Button/Button';
import Spinner from '../Spinner/Spinner';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import parseErrorObject from '../../helpers/parseErrorObject';
import createMemberSchema from './createSizeSchema';

function NewSizeForm({
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
    onError(
      actionError?.message ?? 'Ocurrió un error.',
    );
  }, [actionError]);

  useEffect(() => {
    // activar callback cuando la acción es exitosa
    if (!result) return;
    onSuccess('Se ha agregado la talla de forma exitosa.');
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

    // Parsear formulario
    const formCopy = { ...form };
    if (!(formCopy.supplier?.length > 0)) delete formCopy.supplier;
    if (!(formCopy.details?.length > 0)) delete formCopy.details;

    // Enviar formulario
    const uri = `${serverHost}/generalInfo/size/`;
    const method = 'POST';
    fetchResult({
      uri,
      method,
      headers: { authorization: token },
      body: JSON.stringify(formCopy),
      parse: false,
    });

    setError({});
  };
  return (
    <form className={styles.newSizeForm} onSubmit={handleSubmit}>
      <h1>Nueva Talla</h1>
      <hr />

      <div className={styles.formContainer}>
        <InputText
          title="Talla:"
          name="size"
          onChange={handleChange}
          value={form.size}
          error={error.size}
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

export default NewSizeForm;

NewSizeForm.propTypes = {
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
