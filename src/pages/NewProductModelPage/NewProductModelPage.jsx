import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import styles from './NewProductModelPage.module.css';
import InputSelect from '../../components/InputSelect/InputSelect';
import InputText from '../../components/InputText/InputText';
import TextArea from '../../components/TextArea/TextArea';
import ImagePicker from '../../components/ImagePicker/ImagePicker';
import Button from '../../components/Button/Button';
import Spinner from '../../components/Spinner/Spinner';
import useForm from '../../hooks/useForm';
import newProductModelSchema from './newProductModelSchema';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import SubLoadingView from '../../components/SubLoadingView/SubLoadingView';
import usePopUp from '../../hooks/usePopUp';
import SuccessNotificationPopUp from '../../components/SuccessNotificationPopUp/SuccessNotificationPopUp';
import ErrorNotificationPopUp from '../../components/ErrorNotificationPopUp/ErrorNotificationPopUp';

function NewProductModelPage() {
  const {
    form, error, setData, validateField, clearFieldError, validateForm,
  } = useForm({
    schema: newProductModelSchema,
  });

  const {
    callFetch: getTypesFetch,
    result: productTypes,
    loading: loadingTypes,
    error: typesError,
  } = useFetch();

  const {
    callFetch: getOrganizationsFetch,
    result: organizations,
    loading: loadingOrganizations,
    error: organizationsError,
  } = useFetch();

  const {
    callFetch: postProductModel,
    result: productModelResult,
    loading: productModelLoading,
    error: productModelError,
  } = useFetch();
  const token = useToken();

  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();

  const navigate = useNavigate();

  useEffect(() => {
    // Obtener opciones del formulario
    getTypesFetch({ uri: `${serverHost}/product/type`, headers: { authorization: token } });
    getOrganizationsFetch({ uri: `${serverHost}/organization`, headers: { authorization: token } });
  }, []);

  useEffect(() => {
    if (!organizationsError && !typesError) return;
    openError();
  }, [organizationsError, typesError]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  const saveImages = (files) => setData('images', files);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = await validateForm();
    if (err) return;

    const uri = `${serverHost}/product/model`;

    const data = new FormData();

    // guardar información en un formdata
    const {
      name, idClientOrganization, type, details, images,
    } = form;
    data.append('name', name);
    data.append('idClientOrganization', idClientOrganization);
    data.append('type', type);
    if (details?.trim().length > 0) data.append('details', details);

    images?.forEach((file) => data.append('images[]', file, file.name));

    // enviar información
    postProductModel({
      uri,
      method: 'POST',
      body: data,
      headers: { authorization: token },
      removeContentType: true,
    });
  };

  useEffect(() => {
    if (!productModelResult) return;
    openSuccess();
  }, [productModelResult]);

  const successCallback = () => navigate('/');

  return (
    <div className={styles.newProductModelPage}>
      <h1 className={styles.pageTitle}>Nuevo producto</h1>

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h3 className={styles.formSectionTitle}>Organización Cliente</h3>
        <p className={styles.formSectionDesc}>La Organización podrá ver el producto creado.</p>
        <InputSelect
          title="Organización cliente:"
          name="idClientOrganization"
          value={form.idClientOrganization}
          error={error?.idClientOrganization}
          onChange={onChange}
          onFocus={(e) => clearFieldError(e.target.name)}
          onBlur={(e) => validateField(e.target.name)}
          options={organizations?.result?.map((val) => ({ title: val.name, value: val.id }))}
          disabled={!organizations}
        />
        <h3 className={styles.formSectionTitle}>Datos del producto</h3>
        <p className={styles.formSectionDesc}>Procura ser lo más detallado posible.</p>
        <InputText
          title="Nombre del producto:"
          name="name"
          value={form.name}
          error={error?.name}
          onChange={onChange}
          onFocus={(e) => clearFieldError(e.target.name)}
          onBlur={(e) => validateField(e.target.name)}
          placeholder="Ingresar nombre del producto"
        />
        <InputSelect
          title="Tipo de producto:"
          name="type"
          value={form.type}
          error={error?.type}
          onChange={onChange}
          onFocus={(e) => clearFieldError(e.target.name)}
          onBlur={(e) => validateField(e.target.name)}
          options={productTypes?.map((val) => ({ value: val.id, title: val.name }))}
          disabled={!productTypes}
        />
        <TextArea
          className={styles.aditionalDetails}
          title="Detalles adicionales:"
          name="details"
          value={form.details}
          error={error?.details}
          onChange={onChange}
          onFocus={(e) => clearFieldError(e.target.name)}
          onBlur={(e) => validateField(e.target.name)}
        />
        <h3 className={styles.formSectionTitle}>Imágenes de referencia</h3>
        <p className={styles.formSectionDesc}>
          Adjunta cualquier imagen que pueda ayudar a comprender mejor tus pedidos.
        </p>
        <ImagePicker className={styles.imagePicker} setImageFiles={saveImages} />
        {productModelError && <p className={styles.errorMessage}>{productModelError.message}</p>}
        <div className={styles.buttonContainer}>
          {productModelLoading && <Spinner />}
          {!productModelLoading && !productModelResult && (
            <Button text="Crear producto" className={styles.sendButton} type="submit" />
          )}
        </div>
        {(loadingTypes || loadingOrganizations) && <SubLoadingView />}
      </form>

      <ErrorNotificationPopUp
        isOpen={isErrorOpen}
        close={closeError}
        title="Ocurrió un error"
        text={
          // eslint-disable-next-line no-nested-ternary
          typesError
            ? 'No se encontraron tipos de productos.'
            : organizationsError
              ? 'No se encontraron organizaciones.'
              : 'Ocurrió un error.'
        }
      />
      <SuccessNotificationPopUp
        isOpen={isSuccessOpen}
        close={closeSuccess}
        title="Operación exitosa"
        text="El producto se ha creado correctamente."
        callback={successCallback}
      />
    </div>
  );
}

export default NewProductModelPage;

NewProductModelPage.propTypes = {};

NewProductModelPage.defaultProps = {};
