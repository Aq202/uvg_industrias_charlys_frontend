import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@components/Button/Button';
import Spinner from '@components/Spinner/Spinner';
import useFetch from '@hooks/useFetch';
import { serverHost } from '@/config';
import useToken from '@hooks/useToken';
import styles from './DeleteProductType.module.css';

function DeleteProductType({
  id, name, onError, onSuccess, onCancel,
}) {
  const token = useToken();

  const {
    callFetch: fetchResult, result, loading: actionLoading, error: actionError,
  } = useFetch();

  useEffect(() => {
    if (!actionError) return;
    // mandar mensaje de error
    onError(
      actionError?.message ?? 'Ocurrió un error.',
    );
  }, [actionError]);

  useEffect(() => {
    // activar callback cuando la acción es exitosa
    if (!result) return;
    onSuccess('Se ha eliminado el tipo de producto de forma exitosa.');
  }, [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enviar formulario
    const uri = `${serverHost}/product/type/${id}`;
    const method = 'DELETE';
    fetchResult({
      uri,
      method,
      headers: { authorization: token },
    });
  };

  return (
    <form className={styles.deleteSize} onSubmit={handleSubmit}>
      <h1>Eliminar tipo de producto</h1>
      <hr />
      <p>
        {' '}
        ¿Está seguro que desea eliminar el tipo de producto
        {' '}
        {name}
        ?
      </p>
      <hr />
      <div className={styles.bottomItemsContainer}>
        {actionLoading && <Spinner />}
        {!actionLoading && !result && (
          <>
            <Button text="Eliminar" type="submit" />
            <Button text="Cancelar" emptyRed type="button" onClick={onCancel} />
          </>
        )}
      </div>
    </form>
  );
}

export default DeleteProductType;

DeleteProductType.propTypes = {
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

DeleteProductType.defaultProps = {
};
