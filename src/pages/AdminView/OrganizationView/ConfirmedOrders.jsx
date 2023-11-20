import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from '@mui/material';
import moment from 'moment';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import useToken from '@hooks/useToken';
import SearchInput from '@components/SearchInput/SearchInput';
import Table from '@components/Table/Table';
import TableRow from '@components/TableRow/TableRow';
import DateSearch from '@components/DateSearch/DateSearch';
import DropdownMenuProductType from '@components/DropdownMenuMultProductType/DropdownMenuProducType';
import styles from './ConfirmedOrders.module.css';

function ConfirmedOrders({ orgId }) {
  const {
    callFetch, result, loading,
  } = useFetch();

  const token = useToken();
  const [query, setQuery] = useState(null);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [types, setTypes] = useState([]);
  const [currPage, setCurrPage] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams({ page: currPage });
    if (query) {
      params.set('search', query);
    }

    const uri = `${serverHost}/organization/orders/${orgId}?${params.toString()}`;

    callFetch({ uri, headers: { authorization: token } });
  }, [query, startDate, endDate, types, currPage]);

  const searchText = (search) => {
    if (search?.trim().length > 0) setQuery(search);
    else setQuery(null);
  };

  const searchDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleTypeSelection = (typesSelected) => {
    setTypes(typesSelected);
  };

  const handlePageChange = (e, page) => {
    e.preventDefault();
    setCurrPage(page - 1);
  };

  return (
    <div className={styles.ConfirmedOrders}>
      <div className={styles.header}>
        <h2>
          Pedidos confirmados
        </h2>
      </div>
      <div className={styles.ConfirmedOrdersList}>
        <div className={styles.searchContainer}>
          <SearchInput handleSearch={searchText} />
          <DateSearch
            onSearch={searchDate}
          />
          <DropdownMenuProductType
            orgId={orgId}
            onChange={handleTypeSelection}
          />
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
            {result?.result.map((val) => (
              <TableRow key={val.id}>
                <td>{val.id}</td>
                <td>{val.description}</td>
                <td>{val.deadline ? moment(val.deadline).format('DD-MM-YYYY') : 'S.F.'}</td>
              </TableRow>
            ))}
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

ConfirmedOrders.propTypes = {
  orgId: PropTypes.string.isRequired,
};

export default ConfirmedOrders;
