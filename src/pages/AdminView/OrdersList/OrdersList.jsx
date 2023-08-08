import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Order from '@components/Order/Order';
import NavBar from '@components/NavBar/NavBar';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import styles from './OrdersList.module.css';
import useToken from '../../../hooks/useToken';
import Spinner from '../../../components/Spinner/Spinner';
import SearchInput from '../../../components/SearchInput/SearchInput';
import randomString from '../../../helpers/randomString';

function OrdersList() {
  const [query, setQuery] = useState(null);
  const token = useToken();
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

    callFetch({ uri, headers: { authorization: token } });
  }, [query]);

  return (
    <div className={`${styles.OrdersList}`}>
      <header>
        <NavBar loggedIn />
      </header>
      <main>
        <div className={`${styles.topHeader}`}>
          <span className={`${styles.title}`}>Lista de solicitudes de pedidos</span>
          <SearchInput className={`${styles.searchInput}`} handleSearch={handleSearch} />
        </div>
        <div className={`${styles.orders}`}>
          {error && 'Ocurrió un error.'}
          {loading && <Spinner />}
          {result?.length > 0
            && result.map((val) => (
              <Order
                id={val.id}
                cliente={val.client}
                fechaSolicitada={moment(val.datePlaced).format('DD-MM-YYYY')}
                descripcion={val.description}
                key={randomString()}
              />
            ))}
        </div>
      </main>
    </div>
  );
}

export default OrdersList;
