import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './DeleteMember.module.css';
import Button from '../Button/Button';
import Spinner from '../Spinner/Spinner';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';

function DeleteMember({
  id, orgName, name, onError, onSuccess, onCancel,
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
    onSuccess('Se ha eliminado al miembro de forma exitosa.');
  }, [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enviar formulario
    const uri = `${serverHost}/user/client/${id}`;
    const method = 'DELETE';
    fetchResult({
      uri,
      method,
      headers: { authorization: token },
      parse: false,
    });
  };

  return (
    <form className={styles.deleteMember} onSubmit={handleSubmit}>
      <h1>Eliminar Miembro</h1>
      <hr />
      <p>
        {' '}
        ¿Está seguro que desea eliminar al miembro
        {' '}
        {name}
        {' '}
        de la organización
        {' '}
        {orgName}
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

export default DeleteMember;

DeleteMember.propTypes = {
  id: PropTypes.string,
  orgName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

DeleteMember.defaultProps = {
  id: null,
};
