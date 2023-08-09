import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import useToken from '../../../hooks/useToken';
import Button from '../../../components/Button/Button';
import InputText from '../../../components/InputText/InputText';
import Spinner from '../../../components/Spinner/Spinner';
import Table from '../../../components/Table/Table';
import TableRow from '../../../components/TableRow/TableRow';
import styles from './ConfirmedOrders.module.css';

function ConfirmedOrders({ orgId }) {
  const {
    callFetch, result, error, loading,
  } = useFetch();

  const token = useToken();
  const [search, setSearch] = useState('');

  useEffect(() => {
    callFetch({ uri: `${serverHost}/organization/orders/${orgId}`, headers: { authorization: token } });
  }, []);

  const searchRequest = () => {
    callFetch({
      uri: `${serverHost}/organization/orders/:${orgId}?search=${search}`,
      headers: { authorization: token },
    });
  };

  const renderConfirmedOrders = () => (
    <Table
      header={['ID', 'Descripción', 'Fecha']}
      breakPoint="280px"
      maxCellWidth="140px"
      showCheckbox={false}
      className={styles.table}
    >
      {
        result.result.map((val) => (
          <TableRow key={val.id}>
            <td>{val.id}</td>
            <td>{val.description}</td>
            <td>{val.date_placed}</td>
          </TableRow>
        ))
      }
    </Table>
  );

  return (
    <div className={styles.ConfirmedOrders}>
      <div className={styles.header}>
        <h2>
          Pedidos confirmados
        </h2>
        <Button text="Nuevo" />
      </div>
      <div className={styles.ConfirmedOrdersList}>
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
          {result?.result.length > 0 ? renderConfirmedOrders() : null}
        </div>
      </div>
    </div>
  );
}

ConfirmedOrders.propTypes = {
  orgId: PropTypes.string.isRequired,
};

export default ConfirmedOrders;
