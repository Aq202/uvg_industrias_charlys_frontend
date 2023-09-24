import React, { useState, useEffect } from 'react';
import { Pagination } from '@mui/material';
import InputDate from '../../components/InputDate/InputDate';
import styles from './ConfirmedOrdersPage.module.css';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import LoadingView from '../../components/LoadingView/LoadingView';
import SearchInput from '../../components/SearchInput/SearchInput';
import ConfirmedOrder from '../../components/ConfirmedOrder/ConfirmedOrder';

function ConfirmedOrdersPage() {
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
    const { startdeadline, enddeadline, product } = filter;
    const paramsObj = { page: currentPage };

    if (startdeadline !== undefined && startdeadline !== '') paramsObj.startDeadline = startdeadline;
    if (enddeadline !== undefined && enddeadline !== '') paramsObj.endDeadline = enddeadline;
    if (product !== undefined && product !== '') paramsObj.idProduct = product;

    const searchParams = new URLSearchParams(paramsObj);
    getOrders({
      uri: `${serverHost}/organization/orders?${searchParams.toString()}`,
      headers: { authorization: token },
    });
  };

  useEffect(() => {
    getConfirmedOrders();
  }, [currentPage, filter]);

  useEffect(() => {
  }, [resultOrders]);

  return (
    <div className={styles.confirmedOrdersPage}>
      {loadingOrders && <LoadingView />}
      <h1 className={styles.pageTitle}>Órdenes confirmadas</h1>
      <div className={styles.listContainer}>
        {true && (
          <div className={styles.filtersContainer}>
            <InputDate
              className={styles.inputDate}
              value={filter.startdeadline}
              name="startdeadline"
              title="Fecha límite desde:"
              onChange={(e) => handleChange('startdeadline', e.target.value)}
            />
            <InputDate
              className={styles.inputDate}
              value={filter.enddeadline}
              name="enddeadline"
              title="Fecha límite hasta:"
              onChange={(e) => handleChange('enddeadline', e.target.value)}
            />
            <SearchInput
              className={styles.inputSearch}
              handleSearch={(val) => handleChange('product', val)}
              name="product"
              placeholder="Buscar por ID de producto"
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
          {resultOrders.result.map((order) => (
            <ConfirmedOrder
              key={order.id}
              id={order.id}
              deadline={order.deadline}
              description={order.description}
            />
          ))}
        </div>
        )}
        {!errorOrders && resultOrders && (
          <Pagination
            count={+resultOrders.count}
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
