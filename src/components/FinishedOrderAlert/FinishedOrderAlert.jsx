import React from 'react';
// import PropTypes from 'prop-types';
import { FaCheckCircle as FinishedIcon } from 'react-icons/fa';
import styles from './FinishedOrderAlert.module.css';

function FinishedOrderAlert() {
  return (
    <div className={styles.finishedOrderAlert}>
      <FinishedIcon className={styles.finishedIcon} />
      El pedido ha sido finalizado
    </div>
  );
}

export default FinishedOrderAlert;

FinishedOrderAlert.propTypes = {

};

FinishedOrderAlert.defaultProps = {

};
