import * as yup from 'yup';

export default yup.object().shape({
  password: yup.string().nullable().required('Debes ingresar tu contraseña.'),
  email: yup.string().nullable().required('Debes ingresar tu email.'),
});
