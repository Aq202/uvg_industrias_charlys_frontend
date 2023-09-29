import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import styles from './ProductionControlPage.module.css';
import OrdersInProductionList from '../../components/OrdersInProductionList/OrdersInProductionList';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import LoadingView from '../../components/LoadingView/LoadingView';
import Button from '../../components/Button/Button';
import OrderProgressBar from '../../components/OrderProgressBar/OrderProgressBar';

function ProductionControlPage() {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isLoadingOrdersList, setIsLoadingOrdersList] = useState(true);

  const {
    callFetch: fetchOrderData, result: orderData, loading: loadingOrder,
  } = useFetch();

  const token = useToken();

  useEffect(() => {
    if (!currentOrder) return;

    fetchOrderData({ uri: `${serverHost}/order/${currentOrder}`, headers: { authorization: token } });
  }, [currentOrder]);

  const handleOrderChange = (orderId, isLoading) => {
    if (!isLoading && orderId) setIsLoadingOrdersList(false);
    setCurrentOrder(orderId);
  };
  return (
    <div className={styles.productionControlPage}>
      <h1 className={styles.pageTitle}>Control de producción</h1>
      <div className={styles.productionControlPageContainer}>
        <OrdersInProductionList onChange={handleOrderChange} />

        <div className={styles.mainContainer}>
          {orderData && (
            <>
              <div className={styles.orderData}>
                <p>
                  <span className={styles.fieldTitle}>Cliente: </span>
                  {orderData.clientOrganization}
                </p>
                <p>
                  <span className={styles.fieldTitle}>Fecha de entrega: </span>
                  {orderData.deadline ? moment(orderData.deadline).format('DD/MM/YYYY') : 'Sin fecha de entrega'}
                </p>
                <p className={styles.oneLine}>
                  <span className={styles.fieldTitle}>Descripción: </span>
                  {orderData.description || 'Sin descripción'}
                </p>
              </div>

              <Link to="/">Ver detalles del pedido</Link>

              <div className={styles.orderStateContainer}>
                <div className={styles.orderStateHeader}>
                  <h3 className={styles.sectionTitle}>Estado del producto</h3>
                  <Button text="Actualizar estado" />
                </div>
                <OrderProgressBar stage={orderData.phase.id ?? 0} />
              </div>
            </>
          )}
        </div>
      </div>

      {(isLoadingOrdersList || loadingOrder) && <LoadingView />}
    </div>
  );
}

export default ProductionControlPage;

ProductionControlPage.propTypes = {

};

ProductionControlPage.defaultProps = {

};
