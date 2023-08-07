import * as yup from 'yup';

export default yup
  .object()
  .shape({
    type: yup.string().required('Debes seleccionar el tipo de producto.'),
    idClientOrganization: yup.string().required('Debes seleccionar una organización.'),
    name: yup.string().required('Debes ingresar el nombre del producto.'),
  });
