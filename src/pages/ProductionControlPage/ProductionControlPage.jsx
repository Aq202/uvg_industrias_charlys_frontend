import React from 'react';
// import PropTypes from 'prop-types';
import styles from './ProductionControlPage.module.css';
import OrdersInProductionList from '../../components/OrdersInProductionList/OrdersInProductionList';

function ProductionControlPage() {
  return (
    <div className={styles.productionControlPage}>
      <h1 className={styles.pageTitle}>Control de producción</h1>
      <div className={styles.productionControlPageContainer}>
        <OrdersInProductionList />
        <div className={styles.mainContainer} />
      </div>
    </div>
  );
}

export default ProductionControlPage;

ProductionControlPage.propTypes = {

};

ProductionControlPage.defaultProps = {

};
