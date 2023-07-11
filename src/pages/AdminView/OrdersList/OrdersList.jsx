import React, { useEffect } from 'react';
import Searcher from '@components/Searcher/Searcher';
import Order from '@components/Order/Order';
import NavBar from '@components/NavBar/NavBar';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import moment from 'moment';
import styles from './OrdersList.module.css';
import useToken from '../../../hooks/useToken';
import Spinner from '../../../components/Spinner/Spinner';

function OrdersList() {
  const token = useToken();
  const {
    callFetch, result, error, loading,
  } = useFetch();

  useEffect(() => {
    callFetch({ uri: `${serverHost}/orderRequest`, headers: { authorization: token } });
  }, []);

  return (
    <div className={`${styles.OrdersList}`}>
      <header>
        <NavBar loggedIn />
      </header>
      <main>
        <div className={`${styles.top}`}>
          <span className={`${styles.title}`}>Lista de solicitudes de pedidos</span>
          <Searcher className={`${styles.search}`} />
        </div>
        <div className={`${styles.orders}`}>
          {error && 'Ocurrió un error.'}
          {loading && <Spinner />}
          {result?.length > 0
            && result.map((val) => (
              <Order
                id={val.id}
                cliente={val.customerName}
                fechaSolicitada={moment(val.datePlaced).format('DD-MM-YYYY')}
                descripcion={val.description}
              />
            ))}
        </div>
      </main>
    </div>
  );
}

export default OrdersList;
