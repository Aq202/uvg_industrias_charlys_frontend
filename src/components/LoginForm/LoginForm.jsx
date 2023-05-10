import React, { useEffect, useState } from 'react';
import './LoginForm.css';
import useLogin from '@hooks/useLogin';
import InputText from '@components/InputText';
import { button, aqua } from '@styles/buttons.module.css';
import Spinner from '@components/Spinner';
import { useNavigate } from 'react-router';

function LoginForm() {
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState({});
  const navigate = useNavigate();

  const {
    login, success, error, loading,
  } = useLogin();

  const handleFormChange = (e) => {
    const field = e.target.name;
    const { value } = e.target;
    setForm((lastValue) => ({ ...lastValue, [field]: value }));
  };

  const validateEmail = () => {
    if (form?.email?.trim().length > 0) return true;
    setFormError((lastVal) => ({ ...lastVal, email: 'El email es obligatorio.' }));
    return false;
  };

  const validatePassword = () => {
    if (form?.password?.trim().length > 0) return true;
    setFormError((lastVal) => ({ ...lastVal, password: 'La contraseña es obligatoria.' }));
    return false;
  };

  const clearErrors = () => {
    setFormError({});
  };

  const handleSubmit = () => {
    clearErrors();
    // eslint-disable-next-line no-bitwise
    if (!(validateEmail() & validatePassword())) return;

    login(form);
  };

  useEffect(() => {
    if (!success) return;
    navigate('/');
  }, [success]);

  return (
    <form className="loginForm">
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
          />
          <InputText
            type="password"
            title="contraseña"
            name="password"
            placeholder="Ingresa tu contraseña."
            error={formError?.password}
            onChange={handleFormChange}
            value={form?.password}
          />

          {error && <div className="error-message">{error?.message ?? 'Ocurrió un error.'}</div> }
          {!loading && !success && (
            <button type="button" className={`${button} ${aqua}`} onClick={handleSubmit}>
              Ingresar
            </button>
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
