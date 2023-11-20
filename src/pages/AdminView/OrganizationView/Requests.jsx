import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from '@mui/material';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import moment from 'moment';
import useToken from '../../../hooks/useToken';
import Button from '../../../components/Button/Button';
import SearchInput from '../../../components/SearchInput/SearchInput';
import Table from '../../../components/Table/Table';
import TableRow from '../../../components/TableRow/TableRow';
import styles from './Requests.module.css';
import DateSearch from '../../../components/DateSearch/DateSearch';
import AppLink from '../../../components/Link/AppLink';

function Requests({ orgId }) {
  const {
    callFetch, result, loading,
  } = useFetch();

  const token = useToken();
  const [query, setQuery] = useState(null);
  const [currPage, setCurrPage] = useState(0);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const handleSearch = (val) => {
    if (val?.trim().length > 0) setQuery(val);
    else setQuery(null);
  };

  useEffect(() => {
    const params = new URLSearchParams({ page: currPage });
    if (query) {
      params.set('search', query);
    }

    if (startDate) {
      params.set('startDatePlaced', startDate);
    }

    if (endDate) {
      params.set('endDatePlaced', endDate);
    }

    const uri = `${serverHost}/organization/orderRequests/${orgId}?${params.toString()}`;

    callFetch({ uri, headers: { authorization: token } });
  }, [query, currPage, startDate, endDate]);

  const handlePageChange = (e, page) => {
    e.preventDefault();
    setCurrPage(page - 1);
  };

  const searchDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
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
          <DateSearch
            onSearch={searchDate}
          />
          <SearchInput handleSearch={handleSearch} />
        </div>
        <div className={styles.content}>
          <Table
            header={['ID', 'Descripción', 'Fecha solicitud']}
            breakPoint="280px"
            maxCellWidth="140px"
            showCheckbox={false}
            className={styles.table}
            loading={loading}
          >
            {
              result?.result.map((val) => (
                <TableRow key={val.id}>
                  <td><AppLink to={`/solicitudOrden/${val.id}`}>{val.id}</AppLink></td>
                  <td>{val.description}</td>
                  <td>{val.date_placed ? moment(val.date_placed).format('DD-MM-YYYY') : 'S.F.'}</td>
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
