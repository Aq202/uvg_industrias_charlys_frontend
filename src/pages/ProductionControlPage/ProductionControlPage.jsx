import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Link, Route, Routes, useLocation, useParams,
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
import ProgressTable from '../../components/ProgressTable/ProgressTable';
import useCount from '../../hooks/useCount';
import UpdateProductionStagePopUp from '../../components/UpdateProductionStagePopUp/UpdateProductionStagePopUp';
import usePopUp from '../../hooks/usePopUp';
import ProductionActionButton from './ProductionActionButton/ProductionActionButton';

function ProductionControlPage() {
  const { callFetch: fetchOrderData, result: orderResult, loading: loadingOrder } = useFetch();
  const { getMultipleApiImages, result: productImages } = useApiMultipleImages();

  const token = useToken();

  const { orderId: currentOrder } = useParams();
  const location = useLocation();

  const {
    count: forceUpdateOrderDataTrigger,
    next: fireForceUpdateOrderDataTrigger,
  } = useCount(0);
  const {
    count: forceUpdateOrdersListTrigger,
    next: fireForceUpdatOrdersListTrigger,
  } = useCount(0);
  const { count: resetSliderTrigger, next: fireResetSliderTrigger } = useCount();

  const [orderData, setOrderData] = useState();
  const [isLoadingOrdersList, setIsLoadingOrdersList] = useState(true);
  const [orderDetail, setOrderDetail] = useState(null);
  const [productSelection, setProductSelection] = useState(null);

  const [isUpdateProductionOpen, openUpdateProduction, closeUpdateProduction] = usePopUp();

  const currentProduct = orderData?.detail?.find((order) => order.id === productSelection);

  useEffect(() => {
    if (!currentOrder) return;
    // Seleccionar primer producto por default
    fetchOrderData({
      uri: `${serverHost}/order/${currentOrder}`,
      headers: { authorization: token },
    });
  }, [currentOrder, forceUpdateOrderDataTrigger]);

  useEffect(() => {
    if (currentOrder) {
      // Limpiar datos al cambiar de orden
      setProductSelection(null);
      setOrderData(null);
    }
  }, [currentOrder]);

  useEffect(() => {
    // Recargar lista de ordenes, según estado proporcinado en la ruta
    // Esto se produce al redireccionar cuando se eliminó una orden
    if (location?.state?.reload) {
      fireForceUpdatOrdersListTrigger();
    }
  }, [location.state]);

  useEffect(() => {
    // Añadir resultado de orden a variable de estado
    if (orderResult) setOrderData(orderResult);
  }, [orderResult]);

  useEffect(() => {
    if (!orderData) return;
    // añadir datos iniciales de productos de la orden
    setOrderDetail(orderData.detail);

    if (!(orderData.detail?.length > 0)) return;
    // Obtener imagenes protegidas
    getMultipleApiImages(
      orderData.detail
        .filter((order) => order.media?.length > 0)
        .map((order) => ({
          id: order.media[0],
          uri: order.media[0],
        })),
    );
  }, [orderData]);

  useEffect(() => {
    if (orderData && productSelection === null) {
      // Seleccionar primer producto al inicio
      setProductSelection(orderData.detail?.[0]?.id);
      fireResetSliderTrigger(); // Seleccionar primer elemento en slider
    }
  }, [orderData, productSelection]);

  const handleProductSelectionChange = (id) => {
    setProductSelection(id);
  };

  const handleProgressChange = () => {
    fireForceUpdatOrdersListTrigger(); // Forzar actualización de menu lateral y datos de la orden
    fireForceUpdateOrderDataTrigger();
  };

  const handleOrderStageChange = () => {
    fireForceUpdateOrderDataTrigger(); // Actualizar datos de la orden
  };

  return (
    <div className={styles.productionControlPage}>

      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Control de producción</h1>
        <ProductionActionButton idOrder={currentOrder} />
      </header>

      <div className={styles.productionControlPageContainer}>
        <OrdersInProductionList
          onFinishLoading={() => setIsLoadingOrdersList(false)}
          forceUpdate={forceUpdateOrdersListTrigger}
        />

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
                  <Button text="Actualizar estado" name="update-order-state" onClick={openUpdateProduction} />
                </div>
                <OrderProgressBar stage={orderData.phase.id ?? 0} />

                <UpdateProductionStagePopUp
                  isOpen={isUpdateProductionOpen}
                  close={closeUpdateProduction}
                  idOrder={currentOrder}
                  currentPhase={orderData?.phase.id}
                  callback={handleOrderStageChange}
                />
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
                    resetIndex={resetSliderTrigger}
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

                  <TabMenu
                    options={[
                      { text: 'Progreso', href: '' },
                      { text: 'Bitácora de avances', href: 'bitacora' },
                    ]}
                  />

                  <Routes>
                    <Route
                      path="/"
                      element={(
                        <ProgressTable
                          productVariants={currentProduct?.sizes}
                          idProduct={currentProduct?.id}
                          idOrder={orderData?.id}
                          onChange={handleProgressChange}
                        />
                      )}
                    />
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
