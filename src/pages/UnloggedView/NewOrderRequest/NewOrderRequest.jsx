import React, { useEffect, useState } from 'react';
import { serverHost } from '@/config';
import Spinner from '@components/Spinner';
import { useNavigate } from 'react-router-dom';
import SuccessNotificationPopUp from '@components/SuccessNotificationPopUp';
import ErrorNotificationPopUp from '@components/ErrorNotificationPopUp/ErrorNotificationPopUp';
import InputText from '../../../components/InputText/InputText';
import useFetch from '../../../hooks/useFetch';
import styles from './NewOrderRequest.module.css';
import ImagePicker from '../../../components/ImagePicker/ImagePicker';
import TextArea from '../../../components/TextArea/TextArea';
import usePopUp from '../../../hooks/usePopUp';
import Button from '../../../components/Button/Button';

function NewOrderRequest() {
  const {
    callFetch, result, error, loading,
  } = useFetch();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    setForm((lastValue) => ({ ...lastValue, [field]: value }));
  };

  const handleImagePickerChange = (files) => {
    setForm((lastValue) => ({ ...lastValue, files }));
  };

  useEffect(() => {
    if (!result) return;

    openSuccess(); // mostrar alerta
  }, [result]);

  useEffect(() => {
    if (error !== null) {
      // eslint-disable-next-line no-console
      console.log(error);
      openError();
    }
  }, [error]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(loading);
  }, [loading]);

  const clearError = (e) => {
    setErrors((lastVal) => ({ ...lastVal, [e.target.name]: null }));
  };

  const validateName = () => {
    const value = form.name;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, name: 'Se necesita un nombre para el pedido' }));
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

  const validateEmail = () => {
    const value = form.email;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({
        ...lastVal,
        email: 'Se necesita un correo electrónico de contacto',
      }));
      return false;
    }

    return true;
  };

  const validateAddress = () => {
    const value = form.address;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, address: 'Se necesita una dirección de entrega' }));
      return false;
    }

    return true;
  };

  const validateDescription = () => {
    const value = form.description;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({
        ...lastVal,
        description: 'Se necesitan detalles para iniciar el pedido',
      }));
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

    const uri = `${serverHost}/orderRequest`;

    // guardar en formdata
    const formData = new FormData();

    // guardar imagenes
    form.files?.forEach((file) => formData.append('files[]', file, file.name));
    delete form.files;

    // guardar otras props
    Object.entries(form).forEach((item) => formData.append(item[0], item[1]));

    callFetch({
      uri,
      method: 'POST',
      body: formData,
      removeContentType: true,
    });
  };

  const redirectAfterSubmit = () => navigate('/');

  return (
    <div className={styles.mainContainer}>
      <form className={styles.divNuevoPedido} onSubmit={handleSubmit}>
        <h1 className={styles.containerTitle}>Nuevo Pedido</h1>
        <div className={styles.divDatos}>
          <h3 className={styles.oneColumn}>Datos del cliente: </h3>

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

          <h3 className={styles.oneColumn}>Datos del pedido: </h3>
          <span className={`${styles.inputDescription} ${styles.oneColumn}`}>
            Incluye detalles como tipo de producto, cantidad, tipo de tela, color, tallas
            requeridas, etc.
          </span>
          <TextArea
            name="description"
            className={`${styles.detailsTextArea} ${styles.oneColumn}`}
            onChange={handleChange}
            value={form.description}
            error={errors.description}
            onBlur={validateDescription}
            onFocus={clearError}
          />
          <span className={`${styles.inputDescription} ${styles.oneColumn}`}>
            Adjunta imágenes de referencia, como diseños previos y medidas.
          </span>

          <div className={`${styles.imagePickerContainer} ${styles.oneColumn}`}>
            <ImagePicker setImageFiles={handleImagePickerChange} />
          </div>
        </div>

        {!loading && (
          <Button
            className={styles.buttonEnviarPedido}
            aria-label="Send"
            type="submit"
            name="send-form-button"
            text="Enviar pedido"
          />
        )}
        {loading && <Spinner />}
      </form>

      <SuccessNotificationPopUp
        close={closeSuccess}
        isOpen={isSuccessOpen}
        callback={redirectAfterSubmit}
        text="La solicitud de compra ha sido enviada correctamente. Pronto nos pondremos en contacto contigo para concretar el pedido."
      />
      <ErrorNotificationPopUp close={closeError} isOpen={isErrorOpen} text={error?.message} />
    </div>
  );
}

export default NewOrderRequest;
