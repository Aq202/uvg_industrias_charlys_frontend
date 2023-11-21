import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { serverHost } from '@/config';
import styles from './NewOrganizationForm.module.css';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import InputText from '../InputText';
import Spinner from '../Spinner/Spinner';
import Button from '../Button/Button';

function NewOrganizationForm(
  {
    onError,
    onSuccess,
    newOrgId,
    clientInfo,
  },
) {
  const {
    callFetch, result, error, loading,
  } = useFetch();
  const token = useToken();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!clientInfo) return;

    Object.entries(clientInfo).forEach(([key, value]) => {
      setForm((lastValue) => ({ ...lastValue, [key]: value }));
    });
  }, [clientInfo]);

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    setForm((lastValue) => ({ ...lastValue, [field]: value }));
  };

  useEffect(() => {
    if (!result) return;
    if (onSuccess) onSuccess();
    if (newOrgId) newOrgId(result.id);
  }, [result]);

  useEffect(() => {
    if (!error) return;
    if (onError) onError(error?.message);
  }, [error]);

  const clearError = (e) => {
    setErrors((lastVal) => ({ ...lastVal, [e.target.name]: null }));
  };

  const validateName = () => {
    const value = form.name;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, name: 'Se necesita un nombre para la organización' }));
      return false;
    }

    return true;
  };

  const validateEmail = () => {
    const value = form.email;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, email: 'Se necesita un correo electrónico para la organización' }));
      return false;
    }

    return true;
  };

  const validatePhone = () => {
    const value = form.phone;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, phone: 'Se necesita un teléfono de contacto' }));
      return false;
    }

    return true;
  };

  const validateAddress = () => {
    const value = form.address;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, address: 'Se necesita una dirección' }));
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = false;
    if (!validateName()) hasError = true;
    if (!validatePhone()) hasError = true;
    if (!validateEmail()) hasError = true;
    if (!validateAddress()) hasError = true;

    if (hasError) return;

    const uri = `${serverHost}/organization/newOrganization`;

    callFetch({
      uri,
      method: 'POST',
      headers: { Authorization: token },
      body: JSON.stringify(form),
    });
  };

  return (

    <form className={styles.formContainer} onSubmit={handleSubmit}>

      <h1 className={styles.mainTitle}>Registrar organización</h1>

      <div className={styles.fieldsContainer}>

        <InputText
          name="name"
          title="Nombre"
          error={errors.name}
          value={form.name}
          onChange={handleChange}
          onBlur={validateName}
          onFocus={clearError}
        />
        <InputText
          name="phone"
          title="Teléfono"
          error={errors.phone}
          value={form.phone}
          onChange={handleChange}
          onBlur={validatePhone}
          onFocus={clearError}
        />
        <InputText
          name="email"
          title="Correo electrónico"
          error={errors.email}
          value={form.email}
          onChange={handleChange}
          onBlur={validateEmail}
          onFocus={clearError}
        />
        <InputText
          name="address"
          title="Dirección"
          error={errors.address}
          value={form.address}
          onChange={handleChange}
          onBlur={validateAddress}
          onFocus={clearError}
        />

      </div>

      {!loading && (
        <div className={styles.buttonContainer}>
          <Button aria-label="Send" type="submit" text="Registrar" name="create-organization-button" />
        </div>
      )}
      {loading && <Spinner />}
    </form>
  );
}

NewOrganizationForm.propTypes = {
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  newOrgId: PropTypes.func,
  clientInfo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }),
};

NewOrganizationForm.defaultProps = {
  newOrgId: null,
  clientInfo: null,
};

export default NewOrganizationForm;
