import React, { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';
import moment from 'moment';
import Order from '@components/Order/Order';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import searchBanner from '@assets/banner/search-banner.svg';
import styles from './OrdersList.module.css';
import useToken from '../../../hooks/useToken';
import Spinner from '../../../components/Spinner/Spinner';
import SearchInput from '../../../components/SearchInput/SearchInput';
import randomString from '../../../helpers/randomString';

function OrdersList() {
  const [query, setQuery] = useState(null);
  const token = useToken();

  const [currPage, setCurrPage] = useState(0);

  const {
    callFetch, result, error, loading,
  } = useFetch();

  const handleSearch = (val) => {
    if (val?.trim().length > 0) setQuery(val);
    else setQuery(null);
  };

  useEffect(() => {
    let uri = `${serverHost}/orderRequest`;

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
    <div className={`${styles.OrdersList}`}>
      <main>
        <div className={`${styles.topHeader}`}>
          <span className={`${styles.title}`}>Lista de solicitudes de pedidos</span>
          <SearchInput className={`${styles.searchInput}`} handleSearch={handleSearch} />
        </div>
        <div className={`${styles.orders}`}>
          {error && (
          <div className={styles.noResultContainer}>
            <img src={searchBanner} alt="Imágen de búsqueda" />
            <p>No se encontraron resultados</p>
          </div>
          )}
          {loading && <Spinner />}
          {result?.result.length > 0
            && result.result.map((val) => (
              <Order
                id={val.id}
                cliente={val.client}
                fechaSolicitada={moment(val.datePlaced).format('DD-MM-YYYY')}
                descripcion={val.description}
                key={randomString()}
              />
            ))}
        </div>
        {!loading && !error && result && (
          <Pagination
            count={+result.count}
            className={styles.pagination}
            onChange={handlePageChange}
            page={currPage + 1}
          />
        )}
      </main>
    </div>
  );
}

export default OrdersList;
