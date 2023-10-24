import * as yup from 'yup';

export default yup.object().shape({
  size: yup.string().nullable().required('La talla es obligatoria.'),
});
