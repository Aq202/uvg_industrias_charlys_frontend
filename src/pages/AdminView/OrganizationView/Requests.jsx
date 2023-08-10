import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import useToken from '../../../hooks/useToken';
import Button from '../../../components/Button/Button';
import SearchInput from '../../../components/SearchInput/SearchInput';
import Table from '../../../components/Table/Table';
import TableRow from '../../../components/TableRow/TableRow';
import styles from './Requests.module.css';

function Requests({ orgId }) {
  const {
    callFetch, result, loading,
  } = useFetch();

  const token = useToken();

  useEffect(() => {
    callFetch({ uri: `${serverHost}/organization/orderRequests/${orgId}`, headers: { authorization: token } });
  }, []);

  const searchRequest = (search) => {
    callFetch({
      uri: `${serverHost}/organization/orderRequests/:${orgId}?search=${search}`,
      headers: { authorization: token },
    });
  };

  return (
    <div className={styles.requests}>
      <div className={styles.header}>
        <h2>
          Solicitudes
        </h2>
        <Button text="Nuevo" />
      </div>
      <div className={styles.requestsList}>
        <div className={styles.searchContainer}>
          <SearchInput handleSearch={searchRequest} />
        </div>
        <div className={styles.content}>
          <Table
            header={['ID', 'Descripción', 'Fecha']}
            breakPoint="280px"
            maxCellWidth="140px"
            showCheckbox={false}
            className={styles.table}
            loading={loading}
          >
            {
              result?.result.map((val) => (
                <TableRow key={val.id}>
                  <td>{val.id}</td>
                  <td>{val.description}</td>
                  <td>{val.date_placed}</td>
                </TableRow>
              ))
            }
          </Table>
        </div>
      </div>
    </div>
  );
}

Requests.propTypes = {
  orgId: PropTypes.string.isRequired,
};

export default Requests;
