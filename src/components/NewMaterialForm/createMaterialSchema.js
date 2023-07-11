import * as yup from 'yup';

export default yup.object().shape({
  supplier: yup.string().nullable(),
  details: yup.string().nullable(),
  measurementUnit: yup.string().nullable().required('La unidad de medida es obligatoria.'),
  quantity: yup
    .number()
    .typeError('La cantidad debe ser un número.')
    .min(0, 'La cantidad mínima es cero.')
    .required('La cantidad es obligatoria.'),
  type: yup.string().nullable().required('Debes seleccionar un tipo.'),
  name: yup.string().nullable().required('El nombre es obligatorio.'),
});
