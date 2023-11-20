import React, { useState, useEffect } from 'react';
import { Pagination } from '@mui/material';
import InputDate from '../../components/InputDate/InputDate';
import styles from './FinishedOrdersPage.module.css';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import LoadingView from '../../components/LoadingView/LoadingView';
import SearchInput from '../../components/SearchInput/SearchInput';
import ConfirmedOrder from '../../components/ConfirmedOrder/ConfirmedOrder';
import getTokenPayload from '../../helpers/getTokenPayload';

function FinishedOrdersPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState({});
  const {
    callFetch: getOrders, result: resultOrders, loading: loadingOrders, error: errorOrders,
  } = useFetch();

  const token = useToken();
  const userInfo = getTokenPayload(token);

  const handleChange = (name, value) => {
    setCurrentPage(0);
    setFilter((lastVal) => ({ ...lastVal, [name]: value }));
  };

  const handlePageChange = (e, page) => {
    e.preventDefault();
    setCurrentPage(page - 1);
  };

  const getConfirmedOrders = () => {
    const { startdeadline, enddeadline, search } = filter;
    const paramsObj = { page: currentPage };

    if (startdeadline !== undefined && startdeadline !== '') paramsObj.startDeadline = startdeadline;
    if (enddeadline !== undefined && enddeadline !== '') paramsObj.endDeadline = enddeadline;
    if (search !== undefined && search !== '') paramsObj.search = search;

    const searchParams = new URLSearchParams(paramsObj);

    const uri = userInfo.role === 'CLIENT'
      ? `${serverHost}/order/finished?client=${userInfo.clientOrganizationId}&${searchParams.toString()}`
      : `${serverHost}/order/finished?${searchParams.toString()}`;

    getOrders({
      uri,
      headers: { authorization: token },
    });
  };

  useEffect(() => {
    getConfirmedOrders();
  }, [currentPage, filter]);

  return (
    <div className={styles.confirmedOrdersPage}>
      {loadingOrders && <LoadingView />}
      <h1 className={styles.pageTitle}>Órdenes finalizadas</h1>
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
              handleSearch={(val) => handleChange('search', val)}
              name="search"
              placeholder="Buscar..."
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
              client={order.client}
              link={`/orden/${order.id}`}
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

export default FinishedOrdersPage;
