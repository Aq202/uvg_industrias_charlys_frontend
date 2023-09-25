import React, { useState, useEffect } from 'react';
import { Pagination } from '@mui/material';
import InputDate from '../../components/InputDate/InputDate';
import styles from './RequestedOrdersPage.module.css';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import LoadingView from '../../components/LoadingView/LoadingView';
import SearchInput from '../../components/SearchInput/SearchInput';
import RequestedOrder from '../../components/RequestedOrder/RequestedOrder';

function RequestedOrdersPage() {
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
    const { startdateplaced, enddateplaced, product } = filter;
    const paramsObj = { page: currentPage };

    if (startdateplaced !== undefined && startdateplaced !== '') paramsObj.startDatePlaced = startdateplaced;
    if (enddateplaced !== undefined && enddateplaced !== '') paramsObj.endDatePlaced = enddateplaced;
    if (product !== undefined && product !== '') paramsObj.idProduct = product;

    const searchParams = new URLSearchParams(paramsObj);
    getOrders({
      uri: `${serverHost}/organization/orderRequests?${searchParams.toString()}`,
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
      <h1 className={styles.pageTitle}>Solicitudes de órdenes realizadas</h1>
      <div className={styles.listContainer}>
        {true && (
          <div className={styles.filtersContainer}>
            <InputDate
              className={styles.inputDate}
              value={filter.startdateplaced}
              name="startdateplaced"
              title="Fecha de solicitud desde:"
              onChange={(e) => handleChange('startdateplaced', e.target.value)}
            />
            <InputDate
              className={styles.inputDate}
              value={filter.enddateplaced}
              name="enddateplaced"
              title="Fecha de solicitud hasta:"
              onChange={(e) => handleChange('enddateplaced', e.target.value)}
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
            <RequestedOrder
              key={order.id}
              id={order.id}
              datePlaced={order.date_placed}
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

export default RequestedOrdersPage;
