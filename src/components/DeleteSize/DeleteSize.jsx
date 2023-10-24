import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './DeleteSize.module.css';
import Button from '../Button/Button';
import Spinner from '../Spinner/Spinner';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';

function DeleteSize({
  size, onError, onSuccess, onCancel,
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
    onSuccess('Se ha eliminado la talla de forma exitosa.');
  }, [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enviar formulario
    const uri = `${serverHost}/generalInfo/size`;
    const method = 'DELETE';
    fetchResult({
      uri,
      method,
      headers: { authorization: token },
      body: JSON.stringify({ size }),
    });
  };

  return (
    <form className={styles.deleteSize} onSubmit={handleSubmit}>
      <h1>Eliminar Talla</h1>
      <hr />
      <p>
        {' '}
        ¿Está seguro que desea eliminar la talla
        {' '}
        {size}
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

export default DeleteSize;

DeleteSize.propTypes = {
  size: PropTypes.string,
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

DeleteSize.defaultProps = {
  size: null,
};
