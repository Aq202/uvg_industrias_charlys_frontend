import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Link, Route, Routes, useParams,
} from 'react-router-dom';
import styles from './ProductionControlPage.module.css';
import OrdersInProductionList from '../../components/OrdersInProductionList/OrdersInProductionList';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import LoadingView from '../../components/LoadingView/LoadingView';
import Button from '../../components/Button/Button';
import OrderProgressBar from '../../components/OrderProgressBar/OrderProgressBar';
import ProductsSlider from '../../components/ProductsSlider/ProductsSlider';
import useApiMultipleImages from '../../hooks/useApiMultipleImages';
import TabMenu from '../../components/TabMenu/TabMenu';

function ProductionControlPage() {
  const { callFetch: fetchOrderData, result: orderData, loading: loadingOrder } = useFetch();
  const { getMultipleApiImages, result: productImages } = useApiMultipleImages();

  const token = useToken();

  const { orderId: currentOrder } = useParams();

  const [isLoadingOrdersList, setIsLoadingOrdersList] = useState(true);
  const [orderDetail, setOrderDetail] = useState(null);
  const [productSelection, setProductSelection] = useState(null);

  const currentProduct = orderData?.detail?.find((order) => order.id === productSelection);

  useEffect(() => {
    if (!currentOrder) return;

    fetchOrderData({
      uri: `${serverHost}/order/${currentOrder}`,
      headers: { authorization: token },
    });
  }, [currentOrder]);

  useEffect(() => {
    if (!(orderData?.detail?.length > 0)) return;
    // Obtener imagenes protegidas
    getMultipleApiImages(
      orderData.detail
        .filter((order) => order.media?.length > 0)
        .map((order) => ({
          id: order.media[0],
          uri: order.media[0],
        })),
    );

    // añadir datos iniciales de productos de la orden
    setOrderDetail(orderData.detail);
  }, [orderData]);

  const handleProductSelectionChange = (id) => {
    setProductSelection(id);
  };

  return (
    <div className={styles.productionControlPage}>
      <h1 className={styles.pageTitle}>Control de producción</h1>
      <div className={styles.productionControlPageContainer}>
        <OrdersInProductionList onFinishLoading={() => setIsLoadingOrdersList(false)} />

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
                  {orderData.deadline
                    ? moment(orderData.deadline).format('DD/MM/YYYY')
                    : 'Sin fecha de entrega'}
                </p>
                <p className={styles.oneLine}>
                  <span className={styles.fieldTitle}>Descripción: </span>
                  {orderData.description || 'Sin descripción'}
                </p>
              </div>

              <Link to="/">Ver detalles del pedido</Link>

              <div className={styles.orderStateContainer}>
                <div className={styles.orderStateHeader}>
                  <h3 className={styles.sectionTitle}>Estado del pedido</h3>
                  <Button text="Actualizar estado" />
                </div>
                <OrderProgressBar stage={orderData.phase.id ?? 0} />
              </div>

                {orderDetail && (
                <div className={styles.productsData}>
                  <h3 className={styles.sectionTitle}>Productos</h3>
                  <ProductsSlider
                    onChange={handleProductSelectionChange}
                    products={orderDetail.map((order) => ({
                      id: order.id,
                      name: order.product,
                      imageUrl: productImages?.[order.media?.[0]],
                      type: order.type,
                      organization: null,
                      colors: order.colors,
                    }))}
                  />

                  <div className={styles.productSectionHeader}>
                    <p>
                      <span className={styles.fieldTitle}>Producto: </span>
                      {currentProduct?.product}
                    </p>

                    <span className={styles.unitsMissing}>
                      {currentProduct?.sizes?.reduce(
                        (ac, current) => ac + current.quantity - current.completed,
                        0,
                      )}
                      {' '}
                      pendientes
                    </span>
                  </div>
                  <Link to={`/producto/${currentProduct?.id}`}>Ver detalles del producto</Link>

                  <TabMenu options={[{ text: 'Progreso', href: '' },
                    { text: 'Bitácora de avances', href: 'bitacora' }]}
                  />

                  <Routes>
                    <Route path="/" element="hola" />
                    <Route path="/bitacora" element="adios" />
                  </Routes>

                </div>
                )}
            </>
          )}
        </div>
      </div>

      {(isLoadingOrdersList || loadingOrder) && <LoadingView />}
    </div>
  );
}

export default ProductionControlPage;

ProductionControlPage.propTypes = {};

ProductionControlPage.defaultProps = {};
