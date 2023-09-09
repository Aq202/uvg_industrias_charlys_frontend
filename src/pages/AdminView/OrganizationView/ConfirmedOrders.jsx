import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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
    callFetch, result, error, loading,
  } = useFetch();

  const token = useToken();
  const [query, setQuery] = useState(null);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [types, setTypes] = useState([]);

  useEffect(() => {
    let uri = `${serverHost}/organization/orders/${orgId}`;

    if (query) {
      const params = new URLSearchParams({ search: query });
      uri += `?${params.toString()}`;
    }

    callFetch({ uri, headers: { authorization: token } });
  }, [query, startDate, endDate, types]);

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
          {error && 'Ocurrió un error.'}
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
                <td>{val.deadline ? moment(val.deadline).format('DD-MM-YYYY') : 'Null'}</td>
              </TableRow>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
}

ConfirmedOrders.propTypes = {
  orgId: PropTypes.string.isRequired,
};

export default ConfirmedOrders;
