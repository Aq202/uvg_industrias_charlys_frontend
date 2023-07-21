import React, { useState, useEffect } from 'react';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import PropTypes from 'prop-types';
import useToken from '../../../hooks/useToken';
import Button from '../../../components/Button/Button';
import InputText from '../../../components/InputText/InputText';
import Spinner from '../../../components/Spinner/Spinner';
import Table from '../../../components/Table/Table';
import TableRow from '../../../components/TableRow/TableRow';
import styles from './Requests.module.css';

function Requests({ orgId }) {
  const {
    callFetch, result, error, loading,
  } = useFetch();

  const token = useToken();
  const [search, setSearch] = useState('');

  useEffect(() => {
    callFetch({ uri: `${serverHost}/organization/orderRequest/${orgId}`, headers: { authorization: token } });
  }, []);

  const searchRequest = () => {
    callFetch({
      uri: `${serverHost}/organization/orderRequest/${orgId}?search=${search}`,
      headers: { authorization: token },
    });
  };

  const renderRequests = () => (
    <Table
      header={['ID', 'Descripción', 'Fecha']}
      breakPoint="280px"
      maxCellWidth="140px"
      showCheckbox={false}
      className={styles.table}
    >
      {
        result.map((val) => (
          <TableRow key={val.id}>
            <td>{val.id}</td>
            <td>{val.description }</td>
            <td>{val.date_placed}</td>
          </TableRow>
        ))
      }
    </Table>
  );

  return (
    <div className={styles.requests}>
      <div className={styles.header}>
        <h1>
          Solicitudes
        </h1>
        <Button text="Nuevo" />
      </div>
      <div className={styles.requestsList}>
        <div className={styles.searchContainer}>
          <InputText
            onChange={(e) => setSearch(e.target.value)}
            name="search"
            value={search}
          />
          <Button text="Buscar" onClick={searchRequest} type="primary" />
        </div>
        <div className={styles.content}>
          <div className={`${styles.load}`}>
            {error && 'Ocurrió un error'}
            {loading && <Spinner />}
          </div>
          {result?.length > 0 ? renderRequests() : null}
        </div>
      </div>
    </div>
  );
}

Requests.propTypes = {
  orgId: PropTypes.string.isRequired,
};

export default Requests;
