import React, { useEffect, useState } from 'react';
import NavBar from '@components/NavBar';
import { serverHost } from '@/config';
import Spinner from '@components/Spinner';
import { useNavigate } from 'react-router-dom';
import InputText from '../../../components/InputText/InputText';
import useFetch from '../../../hooks/useFetch';
import styles from './NewOrderRequest.module.css';

function NewOrderRequest() {
  const {
    callFetch, result, error, loading,
  } = useFetch();
  const [form, setForm] = useState({});
  const [descripcion, setDescripcion] = useState('');
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name: field, value } = e.target;
    setForm((lastValue) => ({ ...lastValue, [field]: value }));
  };
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line no-console
    if (!result) return;
    // eslint-disable-next-line no-alert
    alert('Solicitud enviada exitosamente');
    navigate('/');
  }, [result]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(error);
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
      setErrors((lastVal) => ({ ...lastVal, email: 'Se necesita un teléfono de contacto' }));
      return false;
    }

    return true;
  };

  const validateAddress = () => {
    const value = form.address;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, address: 'Se necesita un teléfono de contacto' }));
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
    const body = {
      ...form,
      description: descripcion,
    };

    callFetch({
      uri, method: 'POST', body: JSON.stringify(body),
    });
  };

  return (
    <div className={styles.mainContainer}>
      <NavBar loggedIn={false} />
      <div className={styles.divNuevoPedido}>
        <h1>Nuevo Pedido</h1>
        <div className={styles.divDatos}>
          <h3>Datos del cliente: </h3>
          <div className={styles.divDatosCliente}>
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
          <div className={styles.divDetallesPedido}>
            <h3>Datos del pedido: </h3>
            <div className={styles.divInputDetalles} style={{ display: 'flex', flexDirection: 'column', margin: '5px' }}>
              <span style={{ color: 'grey', textAlign: 'start', marginBottom: '10px' }}>Incluye detalles como tipo de producto, cantidad, tipo de tela, color, tallas requeridas, etc.</span>
              <textarea
                type="text"
                style={
                {
                  borderRadius: '5px', border: '1px solid grey', padding: '5px', minHeight: '100px', minWidth: '800px', maxHeight: '1em', maxWidth: '1em',
                }
                }
                onChange={(e) => setDescripcion(e.target.value)}
              />
              {/* <span style={{
                color: 'grey',
                margin: '5px',
                textAlign: 'start',
                marginBottom: '10px',
                marginTop: '20px',
              }}
              >
                Adjunta imágenes de referencia, como diseños previos y medidas.
              </span>
              <label className={styles.divDropContainer} htmlFor="images">
                <img src="icono_camara.svg" alt="icono_camara" />
                <span>Arrastre los archivos aquí</span>
                o
                <input
                  type="file"
                  id="images"
                  accept="image/*, .pdf"
                  multiple
                  style={
                  {
                    width: '350px',
                    maxWidth: '100%',
                    color: '#444'
                     padding: '5px',
                     background: '#fff', borderRadius: '10px', border: '1px solid #555',
                  }
                  }
                />
              </label> */}
            </div>
          </div>
        </div>
        {!loading && <button className={styles.buttonEnviarPedido} aria-label="Send" type="submit" onClick={handleSubmit}>Enviar pedido</button>}
        {loading && <Spinner />}
      </div>
    </div>
  );
}

export default NewOrderRequest;
