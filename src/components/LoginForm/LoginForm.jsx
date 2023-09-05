import React, { useEffect } from 'react';
import './LoginForm.css';
import { useNavigate } from 'react-router';
import useLogin from '@hooks/useLogin';
import InputText from '@components/InputText';
import Spinner from '@components/Spinner';
import Button from '../Button/Button';
import useForm from '../../hooks/useForm';
import loginSchema from './loginSchema';

function LoginForm() {
  const {
    form, setData, error: formError, clearFieldError, clearFormErrors, validateField, validateForm,
  } = useForm({ schema: loginSchema });
  const navigate = useNavigate();

  const {
    login, success, error, loading,
  } = useLogin();

  const handleFormChange = (e) => {
    const field = e.target.name;
    const { value } = e.target;
    setData(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearFormErrors();

    const err = await validateForm();
    if (err) return;

    login(form);
  };

  useEffect(() => {
    if (!success) return;
    navigate('/');
  }, [success]);

  return (
    <form className="loginForm" onSubmit={handleSubmit}>
      <div className="form-container">
        <h1>Iniciar Sesión</h1>
        <div className="inputs-container">
          <InputText
            title="email"
            name="email"
            placeholder="Ingresa tu email."
            error={formError?.email}
            onChange={handleFormChange}
            value={form?.email}
            onBlur={() => validateField('email')}
            onFocus={() => clearFieldError('email')}
          />
          <InputText
            type="password"
            title="contraseña"
            name="password"
            placeholder="Ingresa tu contraseña."
            error={formError?.password}
            onChange={handleFormChange}
            value={form?.password}
            onBlur={() => validateField('password')}
            onFocus={() => clearFieldError('password')}
          />

          {error && <div className="error-message">{error?.message ?? 'Ocurrió un error.'}</div> }
          {!loading && !success && (
            <Button text="Ingresar" type="submit" name="button-login" />
          )}

          {loading && <Spinner />}

          <div className="forgot-password-container">
            <span>¿Olvidaste tu contraseña?</span>
            <a href="./">Recupérala</a>
          </div>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
