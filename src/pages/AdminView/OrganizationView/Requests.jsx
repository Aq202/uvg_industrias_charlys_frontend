import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from '@mui/material';
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
  const [query, setQuery] = useState(null);
  const [currPage, setCurrPage] = useState(0);

  const handleSearch = (val) => {
    if (val?.trim().length > 0) setQuery(val);
    else setQuery(null);
  };

  useEffect(() => {
    let uri = `${serverHost}/organization/orderRequests/${orgId}`;

    if (query) {
      const params = new URLSearchParams({ search: query });
      uri += `?${params.toString()}`;
    }

    const page = new URLSearchParams({ page: currPage });
    uri += `?${page.toString()}`;

    callFetch({ uri, headers: { authorization: token } });
  }, [query, currPage]);

  const handlePageChange = (e, page) => {
    e.preventDefault();
    setCurrPage(page - 1);
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
          <SearchInput handleSearch={handleSearch} />
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
        {!loading && result && (
          <Pagination
            count={+result.count}
            className={styles.pagination}
            onChange={handlePageChange}
            page={currPage + 1}
          />
        )}
      </div>
    </div>
  );
}

Requests.propTypes = {
  orgId: PropTypes.string.isRequired,
};

export default Requests;
