import * as yup from 'yup';

export default yup.object().shape({
  name: yup.string().nullable().required('El nombre es obligatorio.'),
  lastName: yup.string().nullable().required('El apellido es obligatorio.'),
  email: yup.string().nullable().required('El correo electrónico es obligatorio.'),
  phone: yup
    .number()
    .typeError('El teléfono debe ser un número.')
    .integer('El teléfono debe ser un número entero.')
    .positive('El teléfono debe ser positivo.')
    .max(99999999, 'El teléfono debe tener 8 dígitos.')
    .required('El teléfono es obligatorio.'),
  sex: yup.string().nullable().required('Debes seleccionar un género.'),
});
