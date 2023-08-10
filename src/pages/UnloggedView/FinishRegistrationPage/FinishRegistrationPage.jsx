import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import logo from '@assets/logo.png';
import InputText from '@components/InputText/InputText';
import Button from '@components/Button/Button';
// import PropTypes from 'prop-types';
import useForm from '@hooks/useForm';
import useFetch from '@hooks/useFetch';
import LoadingView from '@components/LoadingView/LoadingView';
import getTokenPayload from '@helpers/getTokenPayload';
import Spinner from '@components/Spinner/Spinner';
import useLogin from '@hooks/useLogin';
import usePopUp from '@hooks/usePopUp';
import ErrorNotificationPopUp from '@components/ErrorNotificationPopUp/ErrorNotificationPopUp';
import SuccessNotificationPopUp from '@components/SuccessNotificationPopUp';
import { serverHost } from '@/config';
import registrationSchema from './registrationSchema';
import styles from './FinishRegistrationPage.module.css';
import UnloggedPageContainer from '../UnloggedPageContainer/UnloggedPageContainer';

function FinishRegistrationPage() {
  const {
    form, error, setData, validateField, clearFieldError, validateForm,
  } = useForm({
    schema: registrationSchema,
  });

  const {
    callFetch, loading, error: fetchError, result,
  } = useFetch();
  const {
    callFetch: fetchValidateAccess,
    loading: validateAccessLoading,
    error: validateAccessError,
    result: validateAccessSuccess,
  } = useFetch();
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState(null);
  const [access, setAccess] = useState();

  const { login, success: loginSuccess, error: loginError } = useLogin();

  const [isErrorOpen, openError, closeError] = usePopUp();
  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };
  const handleValidateField = (e) => validateField(e.target.name);
  const handleClearFieldError = (e) => clearFieldError(e.target.name);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = await validateForm();
    if (errors) return;

    callFetch({
      uri: `${serverHost}/user/finishRegistration`,
      method: 'POST',
      body: JSON.stringify(form),
      headers: { authorization: access },
      parse: false,
      autoRefreshAccessToken: false,
    });
  };

  const navigateToHome = () => navigate('/');

  const forceLogin = () => login({ email: userData.email, password: form.password });

  useEffect(() => {
    if (!validateAccessError) return;
    // El token no es valido
    openError();
  }, [validateAccessError]);

  useEffect(() => {
    if (form && form?.password === form.repeatPassword) clearFieldError('repeatPassword');
  }, [form]);

  useEffect(() => {
    if (!searchParams) return;

    const accessParam = searchParams.get('access');

    if (!accessParam) return;
    // realizar petición para validar el token de acceso
    const uri = `${serverHost}/user/validateRegisterToken`;
    fetchValidateAccess({
      uri,
      headers: { authorization: accessParam },
      parse: false,
      autoRefreshAccessToken: false,
    });

    if (!accessParam) {
      openError();
      return;
    }
    // guardar token y datos del token
    try {
      const tokenPayload = getTokenPayload(accessParam);
      setAccess(accessParam);
      setUserData(tokenPayload);
    } catch (ex) {
      openError();
    }
  }, [searchParams]);

  useEffect(() => {
    if (!result) return;
    // Envio de formulario exitoso
    openSuccess();
  }, [result]);

  useEffect(() => {
    if (!loginSuccess && !loginError) return;
    // si se completó o falló el login, redirigir a /
    navigateToHome();
  }, [loginSuccess, loginError]);

  return (
    <UnloggedPageContainer>
      {!validateAccessLoading && validateAccessSuccess && (
        <div className={styles.finishRegistrationPage}>
          <img className={styles.logo} src={logo} alt="Logo de Asigbo" />

          <h1 className={styles.title}>
            ¡Bienvenido
            {' '}
            {userData?.name}
            !
          </h1>
          <p className={styles.instructions}>
            Ayudanos a completar tu perfíl para poder acceder a tu cuenta.
          </p>

          <form onSubmit={handleSubmit}>
            <InputText
              title="Ingresar contraseña."
              onChange={handleChange}
              name="password"
              value={form?.password}
              error={error?.password}
              onFocus={handleClearFieldError}
              onBlur={handleValidateField}
            />
            <InputText
              title="Repetir contraseña."
              onChange={handleChange}
              name="repeatPassword"
              value={form?.repeatPassword}
              error={error?.repeatPassword}
              onFocus={handleClearFieldError}
              onBlur={handleValidateField}
            />
            {fetchError && !loading && <p className={styles.globalError}>{fetchError.message}</p>}
            {!loading && !result
              && <Button type="submit" text="Continuar" className={styles.buttonItem} />}

            {loading && <Spinner className={styles.buttonItem} />}
          </form>
        </div>
      )}
      {validateAccessLoading && <LoadingView />}

      <ErrorNotificationPopUp
        close={closeError}
        text="No estás autorizado para realizar esta acción."
        callback={navigateToHome}
        isOpen={isErrorOpen}
      />

      <SuccessNotificationPopUp
        close={closeSuccess}
        text="Haz completado tu perfil exitosamente."
        callback={forceLogin}
        isOpen={isSuccessOpen}
      />
    </UnloggedPageContainer>
  );
}

export default FinishRegistrationPage;

FinishRegistrationPage.propTypes = {};

FinishRegistrationPage.defaultProps = {};
