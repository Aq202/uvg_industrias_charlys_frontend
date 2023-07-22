import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './NewMemberForm.module.css';
import InputText from '../InputText/InputText';
import InputSelect from '../InputSelect/InputSelect';
import InputNumber from '../InputNumber/InputNumber';
import Button from '../Button/Button';
import Spinner from '../Spinner/Spinner';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import parseErrorObject from '../../helpers/parseErrorObject';
import createMemberSchema from './createMemberSchema';

function NewMemberForm({
  id, onError, onSuccess, onCancel,
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
    onSuccess('Se ha agregado el miembro de forma exitosa.');
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
    if (id) formCopy.idClientOrganization = id;

    // Enviar formulario
    const uri = `${serverHost}/user/client`;
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
    <form className={styles.newMemberForm} onSubmit={handleSubmit}>
      <h1>Nuevo Miembro</h1>
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
        <InputText
          title="Apellido:"
          name="lastName"
          onChange={handleChange}
          value={form.lastName}
          error={error.lastName}
          onBlur={validateField}
          onFocus={clearFieldError}
        />
        <InputText
          title="Correo:"
          name="email"
          onChange={handleChange}
          value={form.email}
          error={error.email}
          onBlur={validateField}
          onFocus={clearFieldError}
        />

        <div className={styles.moreInfoContainer}>
          <InputNumber
            title="Teléfono:"
            name="phone"
            onChange={handleChange}
            value={form.phone}
            min={0}
            step={1}
            error={error.phone}
            onBlur={validateField}
            onFocus={clearFieldError}
          />
          <InputSelect
            title="Género:"
            name="sex"
            options={[{ value: 'M', title: 'M' },
              { value: 'F', title: 'F' }]}
            error={error.sex}
            onChange={handleChange}
            onBlur={validateField}
            onFocus={clearFieldError}
            value={form.sex}
            placeholder=" "
          />
        </div>
      </div>

      <div className={styles.bottomItemsContainer}>
        {actionLoading && <Spinner />}
        {!actionLoading && !result && (
          <>
            <Button text="Enviar" type="submit" />
            <Button text="Cancelar" emptyRed type="button" onClick={onCancel} />
          </>
        )}
      </div>
    </form>
  );
}

export default NewMemberForm;

NewMemberForm.propTypes = {
  id: PropTypes.string,
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

NewMemberForm.defaultProps = {
  id: null,
};
