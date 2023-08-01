import React, { useEffect, useState } from 'react';
import { serverHost } from '@/config';
import SuccessNotificationPopUp from '@components/SuccessNotificationPopUp';
import ErrorNotificationPopUp from '@components/ErrorNotificationPopUp/ErrorNotificationPopUp';
import { useNavigate } from 'react-router';
import styles from './NewOrganizationPage.module.css';
import useFetch from '../../../hooks/useFetch';
import usePopUp from '../../../hooks/usePopUp';
import useToken from '../../../hooks/useToken';
import InputText from '../../../components/InputText/InputText';
import Spinner from '../../../components/Spinner/Spinner';
import Button from '../../../components/Button/Button';

function NewOrganizationPage() {
  const {
    callFetch, result, error, loading,
  } = useFetch();
  const token = useToken();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    setForm((lastValue) => ({ ...lastValue, [field]: value }));
  };

  useEffect(() => {
    if (!result) return;
    openSuccess();
  }, [result]);

  useEffect(() => {
    if (!result) return;
    openError();
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

  const redirectAfterSubmit = () => navigate('/organizaciones');

  return (
    <div className={styles.NewOrganizationPageContainer}>

      <h1 className={styles.mainTitle}>Registrar organización</h1>
      <form className={styles.formContainer} onSubmit={handleSubmit}>

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
        <Button aria-label="Send" type="submit" text="Registrar" name="create-organization-button" />
        )}
        {loading && <Spinner />}
      </form>

      <SuccessNotificationPopUp
        close={closeSuccess}
        isOpen={isSuccessOpen}
        text="La organización ha sido registrada correctamente."
        callback={redirectAfterSubmit}
      />
      <ErrorNotificationPopUp
        close={closeError}
        isOpen={isErrorOpen}
        text={error?.message}
      />

    </div>
  );
}

export default NewOrganizationPage;
