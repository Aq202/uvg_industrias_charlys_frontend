import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './NewColorForm.module.css';
import Button from '../Button/Button';
import Spinner from '../Spinner/Spinner';
import InputText from '../InputText';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';

function NewColorForm({
  onError, onSuccess,
}) {
  const [form, setForm] = useState({ color: '#000000' });
  const [errors, setErrors] = useState({});
  const {
    callFetch, result, loading, error,
  } = useFetch();
  const token = useToken();

  useEffect(() => {
    if (!result) return;
    onSuccess();
  }, [result]);

  useEffect(() => {
    if (!error) return;
    onError();
  }, [error]);

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    setForm((lastValue) => ({ ...lastValue, [field]: value }));
  };

  const clearError = (e) => {
    setErrors((lastVal) => ({ ...lastVal, [e.target.name]: null }));
  };

  const validateColor = () => {
    const value = form.color;
    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, color: 'Se necesita un color' }));
      return false;
    }

    return true;
  };

  const validateName = () => {
    const value = form.name;
    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, name: 'Se necesita un nombre para el color' }));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateColor() || !validateName()) return;

    const uri = `${serverHost}/color/`;
    const body = {
      name: form.name,
      red: parseInt(form.color[1], 16),
      green: parseInt(form.color[2], 16),
      blue: parseInt(form.color[3], 16),
    };

    callFetch({
      uri,
      method: 'POST',
      headers: { Authorization: token },
      body: JSON.stringify(body),
    });
  };

  return (
    <form className={styles.newColorForm} onSubmit={handleSubmit}>
      <h1>Nuevo color</h1>
      <div className={styles.formContainer}>
        <label className={styles.pickerContainer} htmlFor="colorPicker">
          <div className={styles.colorMainContainer}>
            <div className={styles.colorCircle} style={{ backgroundColor: form.color }} />
            <p className={styles.colorName}>
              {' '}
              {form.color.toUpperCase()}
            </p>
          </div>
          <input type="color" value={form.color} onChange={handleChange} className={styles.colorPicker} id="colorPicker" name="color" />
        </label>
      </div>
      <InputText
        title="Nombre"
        name="name"
        onChange={handleChange}
        value={form.name}
        error={errors.name}
        onBlur={validateName}
        onFocus={clearError}
      />
      <div className={styles.buttonContainer}>
        {!loading && <Button text="Guardar" type="submit" name="send-form-button" />}
        {loading && <Spinner />}
      </div>
    </form>
  );
}

NewColorForm.propTypes = {
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default NewColorForm;
