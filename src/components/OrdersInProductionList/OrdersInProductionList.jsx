import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { scrollbarGray } from '@styles/scrollbar.module.css';
import { useNavigate, useParams } from 'react-router';
import styles from './OrdersInProductionList.module.css';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { serverHost } from '../../config';
import Spinner from '../Spinner/Spinner';

/**
 *
 * @param onChange Callback (orderId, loading)
 * Devuelve como parámetro el id de la orden seleccionada.
 * Como segundo parámetro devuelve si aún está cargando las opciones.
 * @returns
 */
function OrdersInProductionList({ onFinishLoading, forceUpdate }) {
  const {
    callFetch: fetchOrdersInProduction,
    result: ordersInProductionList,
    loading,
    error,
  } = useFetch();

  const token = useToken();

  const { orderId } = useParams();
  const navigate = useNavigate();

  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetchOrdersInProduction({
      uri: `${serverHost}/order/inProduction`,
      headers: { authorization: token },
    });
  }, [forceUpdate]);

  useEffect(() => {
    // Si no hay un id seleccionado, seleccionar el primer item
    if (!orderId && ordersInProductionList) {
      setSelectedOrderId(ordersInProductionList[0]?.orderId);
    } else if (orderId) setSelectedOrderId(orderId);
  }, [orderId, ordersInProductionList]);

  useEffect(() => {
    if (onFinishLoading && !loading) onFinishLoading();
  }, [loading]);

  useEffect(() => {
    if (!selectedOrderId) return;
    navigate(`/produccion/${selectedOrderId}`);
  }, [selectedOrderId]);

  return (
    <div className={`${styles.ordersInProductionList}`}>
      <h2 className={styles.title}>Pendientes</h2>

      <div className={`${styles.ordersListContainer}  ${scrollbarGray}`}>
        <div className={`${styles.ordersList}`}>
          {ordersInProductionList?.map((order) => (
            <div
              className={`${styles.orderItem} ${
                selectedOrderId === order.orderId ? styles.current : ''
              }`}
              key={order.orderId}
              onClick={() => setSelectedOrderId(order.orderId)}
              onKeyUp={() => setSelectedOrderId(order.orderId)}
              role="button"
              tabIndex={0}
            >
              <h3 className={styles.itemTitle}>{order.client}</h3>
              <span className={styles.itemDate}>
                {order.deadline
                  ? `Entrega ${moment(order.deadline).format('DD/MM/YYYY')}`
                  : 'Sin fecha de entrega'}
              </span>
              <span className={styles.productsPending}>
                {`${
                  order.pendingUnits ?? 0
                } pendientes`}

              </span>
            </div>
          ))}
        </div>
      </div>
      {(loading || error) && (
        <div className={styles.noResultContainer}>
          {error && <span className={styles.errorMessage}>No se encontraron pedidos nuevos</span>}
          {loading && <Spinner />}
        </div>
      )}
    </div>
  );
}

export default OrdersInProductionList;

OrdersInProductionList.propTypes = {
  onFinishLoading: PropTypes.func,
  forceUpdate: PropTypes.number,
};

OrdersInProductionList.defaultProps = {
  onFinishLoading: null,
  forceUpdate: null,
};
