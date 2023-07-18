import React, { useState, useEffect } from 'react';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import useToken from '../../../hooks/useToken';
import Button from '../../../components/Button/Button';
import InputText from '../../../components/InputText/InputText';
import Spinner from '../../../components/Spinner/Spinner';
import styles from './Members.module.css';

function Members({ orgName }) {
  const {
    callFetch, result, error, loading,
  } = useFetch();

  const token = useToken();
  const [search, setSearch] = useState('');

  useEffect(() => {
    callFetch({ uri: `${serverHost}/inventory`, headers: { authorization: token } });
  }, []);

  const searchMember = () => {
    callFetch({
      uri: `${serverHost}/inventory?search=${search}`,
      headers: { authorization: token },
    });
  };

  const renderMembers = () => (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Sexo</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {result.map((val) => (
          <tr>
            <td>{val.id}</td>
            <td>{val.color}</td>
            <td>{val.quantity}</td>
            <td>
              <div className={`${styles.icons}`}>
                <DeleteIcon />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className={styles.members}>
      <div className={styles.header}>
        <h1>
          Miembros de la organización
          {orgName}
        </h1>
        <Button text="Nuevo" />
      </div>
      <div className={styles.membersList}>
        <div className={styles.searchContainer}>
          <InputText
            onChange={(e) => setSearch(e.target.value)}
            name="search"
            value={search}
          />
          <Button text="Buscar" onClick={searchMember} type="primary" />
        </div>
        <div className={styles.content}>
          <div className={`${styles.load}`}>
            {(error) && 'Ocurrio un error'}
            {(loading) && <Spinner />}
          </div>
          { result?.length > 0 && renderMembers()}
        </div>
      </div>
    </div>
  );
}

Members.propTypes = {
  orgName: PropTypes.string.isRequired,
};

export default Members;
