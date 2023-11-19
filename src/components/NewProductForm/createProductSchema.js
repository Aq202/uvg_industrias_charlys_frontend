import * as yup from 'yup';

export default yup.object().shape({
  client: yup.string().nullable().required('La organización es obligatoria.'),
  order: yup.string().nullable().required('El pedido es obligatorio.'),
  product: yup.string().nullable().required('El producto es obligatorio.'),
  size: yup.string().nullable().required('El tamaño es obligatorio.'),
  quantity: yup
    .number()
    .typeError('La cantidad debe ser un número.')
    .integer('La cantidad debe ser un número entero.')
    .positive('La cantidad debe ser positiva.')
    .required('La cantidad es obligatoria.'),
});
