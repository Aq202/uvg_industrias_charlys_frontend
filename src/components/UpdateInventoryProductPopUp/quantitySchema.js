import * as yup from 'yup';

export default yup.object().shape({
  quantity: yup
    .number()
    .typeError('La cantidad debe ser un número.')
    .integer('La cantidad debe ser un número entero.')
    .positive('La cantidad debe ser positiva.')
    .required('La cantidad es obligatoria.'),
});
