import React, { useState, useEffect } from 'react';
import { Pagination } from '@mui/material';
import InputDate from '../../components/InputDate/InputDate';
import styles from './ConfirmedOrdersPage.module.css';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import getTokenPayload from '../../helpers/getTokenPayload';
import LoadingView from '../../components/LoadingView/LoadingView';
import SearchInput from '../../components/SearchInput/SearchInput';

function ConfirmedOrdersPage() {
  const [orgId, setOrgId] = useState('');
  // const [confirmedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState({});
  const {
    callFetch: getOrders, result: resultOrders, loading: loadingOrders, error: errorOrders,
  } = useFetch();

  const token = useToken();

  const handleChange = (name, value) => {
    setCurrentPage(0);
    setFilter((lastVal) => ({ ...lastVal, [name]: value }));
  };

  const handlePageChange = (e, page) => {
    e.preventDefault();
    setCurrentPage(page - 1);
  };

  const getConfirmedOrders = () => {
    const { date, product } = filter;
    const paramsObj = { page: currentPage };

    if (date !== undefined && date !== '') paramsObj.date = date;
    if (product !== undefined && product !== '') paramsObj.product = product;

    const searchParams = new URLSearchParams(paramsObj);
    getOrders({
      uri: `${serverHost}/order?${searchParams.toString()}`,
      headers: { authorization: token },
    });
  };

  useEffect(() => {
    if (!token) return;
    const tokenPayload = getTokenPayload(token);
    setOrgId(() => tokenPayload.clientOrganizationId);
  }, [token]);

  useEffect(() => {
    if (orgId === '') return;
    getConfirmedOrders();
  }, [orgId]);

  useEffect(() => {
    getConfirmedOrders();
  }, [currentPage, filter]);

  return (
    <div className={styles.confirmedOrdersPage}>
      {loadingOrders && <LoadingView />}
      <h1 className={styles.pageTitle}>Órdenes confirmadas</h1>
      <div className={styles.listContainer}>
        {true && (
          <div className={styles.filtersContainer}>
            <InputDate
              className={styles.inputDate}
              value={filter.date}
              name="date"
              title=""
              onChange={(e) => handleChange('date', e.target.value)}
            />
            <SearchInput
              className={styles.inputSearch}
              handleSearch={(val) => handleChange('search', val)}
              name="search"
            />
          </div>
        )}
        {errorOrders && (
        <div className={styles.errorMessage}>
          No se encontraron órdenes
        </div>
        )}
        {!loadingOrders && resultOrders && (
        <div className={styles.ordersList}>
          Hola
        </div>
        )}
        {!errorOrders && (
          <Pagination
            count={3}
            className={styles.pagination}
            onChange={handlePageChange}
            page={currentPage + 1}
          />
        )}
      </div>
    </div>
  );
}

export default ConfirmedOrdersPage;
