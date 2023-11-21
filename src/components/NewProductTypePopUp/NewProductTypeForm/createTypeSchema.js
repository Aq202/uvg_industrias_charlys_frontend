import * as yup from 'yup';

export default yup.object().shape({
  name: yup.string().nullable().required('El tipo de producto es obligatorio.'),
});
