/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import styles from './UpdateProductModelPage.module.css';
import InputSelect from '../../components/InputSelect/InputSelect';
import InputText from '../../components/InputText/InputText';
import TextArea from '../../components/TextArea/TextArea';
import ImagePicker from '../../components/ImagePicker/ImagePicker';
import Button from '../../components/Button/Button';
import Spinner from '../../components/Spinner/Spinner';
import useForm from '../../hooks/useForm';
import newProductModelSchema from './updateProductModelSchema';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import SubLoadingView from '../../components/SubLoadingView/SubLoadingView';
import usePopUp from '../../hooks/usePopUp';
import SuccessNotificationPopUp from '../../components/SuccessNotificationPopUp/SuccessNotificationPopUp';
import ErrorNotificationPopUp from '../../components/ErrorNotificationPopUp/ErrorNotificationPopUp';
import Thumbanils from '../../components/Thumbnails/Thumbanils';
import useApiMultipleImages from '../../hooks/useApiMultipleImages';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

function UpdateProductModelPage() {
  const { productId } = useParams();
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
    callFetch: updateProductModel,
    result: updateProductModelResult,
    loading: updateProductModelLoading,
    error: updateProductModelError,
  } = useFetch();

  const {
    callFetch: getProductModel,
    result: productModel,
    loading: productModelLoading,
    error: productModelError,
  } = useFetch();

  const token = useToken();

  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();
  const {
    getMultipleApiImages, result: imagesResult, error: imagesError, loading: imagesLoading,
  } = useApiMultipleImages();
  const navigate = useNavigate();
  const [imagesToDelete, setImagesToDelete] = useState([]);

  useEffect(() => {
    // Obtener opciones del formulario
    getTypesFetch({ uri: `${serverHost}/product/type`, headers: { authorization: token } });
    getOrganizationsFetch({ uri: `${serverHost}/organization`, headers: { authorization: token } });
    getProductModel({ uri: `${serverHost}/product/model/${productId}`, headers: { authorization: token } });
  }, []);

  useEffect(() => {
    // escuchar resultado de data de producto
    if (!productModel) return;
    const {
      description, id_client_organization, id_product_type, details, media,
    } = productModel;
    setData('name', description);
    setData('idClientOrganization', id_client_organization);
    setData('type', id_product_type);
    setData('details', details);
    setData('media', media);
    getMultipleApiImages(media?.map((val, index) => ({ id: val, uri: val })));
  }, [productModel]);

  useEffect(() => {
    if (!organizationsError && !typesError && !updateProductModelError) return;
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
    data.append('idProductModel', productId);
    data.append('name', name);
    data.append('idClientOrganization', idClientOrganization);
    data.append('type', type);

    if (details?.trim().length > 0) data.append('details', details);

    images?.forEach((file) => data.append('images[]', file, file.name));

    imagesToDelete?.forEach((img) => data.append('imagesToRemove[]', img));

    // enviar información
    updateProductModel({
      uri,
      method: 'PUT',
      body: data,
      headers: { authorization: token },
      removeContentType: true,
    });
  };

  useEffect(() => {
    if (!updateProductModelResult) return;

    openSuccess();
  }, [updateProductModelResult]);

  const successCallback = () => navigate(`/producto/modelo/${productId}`);

  return (
    <div className={styles.Page}>
      {productModelError && <NotFoundPage />}
      {!productModelError && !productModelLoading && (
      <div className={styles.UpdateProductModelPage}>
        <h1 className={styles.pageTitle}>Actualizar producto</h1>

        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <h3 className={styles.formSectionTitle}>Organización Cliente</h3>
          <p className={styles.formSectionDesc}>
            La Organización podrá ver los cambios realizados a este producto.
          </p>
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
            options={productTypes?.result?.map((val) => ({ value: val.id, title: val.name }))}
            disabled={!productTypes}
          />
          <TextArea
            className={styles.aditionalDetails}
            title="Detalles adicionales:"
            name="details"
            value={form.details || ''}
            error={error?.details}
            onChange={onChange}
            onFocus={(e) => clearFieldError(e.target.name)}
            onBlur={(e) => validateField(e.target.name)}
          />
          {imagesResult && (
          <>
            <h3 className={styles.formSectionTitle}>Imágenes guardadas</h3>
            <p className={styles.formSectionDesc}>
              Estas son las imágenes que se encuentran guardadas actualmente.
            </p>
            <div className={styles.mediaSaved}>

              {imagesLoading && <Spinner />}

              <div className={styles.imageContainer}>
                {
            imagesResult && !imagesLoading
            && (
              Object.entries(imagesResult).map((val) => (
                !imagesToDelete.includes(val[0])
                && (
                <Thumbanils
                  img={val[1]}
                  id={val[0]}
                  key={val[0]}
                  onDeleteClick={(e, id) => {
                    setImagesToDelete((lastValue) => [...lastValue, id]);
                  }}
                />
                )
              ))
            )
         }
              </div>
            </div>
          </>
          )}
          <h3 className={styles.formSectionTitle}>Imágenes de referencia</h3>
          <p className={styles.formSectionDesc}>
            Adjunta cualquier imagen que pueda ayudar a comprender mejor tus pedidos.
          </p>
          <ImagePicker className={styles.imagePicker} setImageFiles={saveImages} />
          {productModelError && <p className={styles.errorMessage}>{productModelError.message}</p>}
          <div className={styles.buttonContainer}>
            {productModelLoading && <Spinner />}
            {!productModelLoading && !updateProductModelResult && (
            <Button
              text="Actualizar producto"
              className={styles.sendButton}
              type="submit"
              name="create-product-button"
            />
            )}
          </div>
          {(loadingTypes || loadingOrganizations || updateProductModelLoading) && (
          <SubLoadingView className={styles.loadingView} />
          )}
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
          text="El producto se ha actualizado correctamente."
          callback={successCallback}
        />
      </div>
      )}
    </div>
  );
}

export default UpdateProductModelPage;

UpdateProductModelPage.propTypes = {};

UpdateProductModelPage.defaultProps = {};
