import React from 'react';
import PropTypes from 'prop-types';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import styles from './Order.module.css';

function Order({ cliente, fechaSolicitada, descripcion }) {
  return (
    <div className={`${styles.order}`}>
      <div className={`${styles.info}`}>
        <div className={`${styles.text}`}>
          <span>Cliente:</span>
          <span>{cliente}</span>
        </div>
        <div className={`${styles.text}`}>
          <span>Fecha Solicitada:</span>
          <span>{fechaSolicitada}</span>
        </div>
        <div className={`${styles.text}`}>
          <span>Descripción:</span>
          <span>{descripcion}</span>
        </div>
      </div>
      <div className={`${styles.button}`}>
        <ArrowCircleRightOutlinedIcon style={{ fontSize: '3em' }} />
      </div>
    </div>
  );
}

Order.propTypes = {
  cliente: PropTypes.string.isRequired,
  fechaSolicitada: PropTypes.string.isRequired,
  descripcion: PropTypes.string.isRequired,
};

export default Order;
