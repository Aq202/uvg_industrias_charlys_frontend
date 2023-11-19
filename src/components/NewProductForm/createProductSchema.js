import * as yup from 'yup';

export default yup.object().shape({
  client: yup.string().min(1, 'Selecciona una organización.').nullable().required('Selecciona una organización.'),
  order: yup.string().min(1, 'Selecciona unar orden.').nullable().required('Selecciona unar orden.'),
  idProduct: yup.string().min(1, 'Selecciona un producto.').nullable().required('Selecciona un producto.'),
  size: yup.string().min(1, 'Selecciona una talla.').nullable().required('Selecciona una talla.'),
  quantity: yup
    .number()
    .typeError('La cantidad debe ser un número.')
    .integer('La cantidad debe ser un número entero.')
    .positive('La cantidad debe ser positiva.')
    .required('La cantidad es obligatoria.'),
});
