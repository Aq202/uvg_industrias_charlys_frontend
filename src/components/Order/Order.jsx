import React from 'react';
import PropTypes from 'prop-types';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { useNavigate } from 'react-router';
import { scrollbarGray } from '@styles/scrollbar.module.css';
import styles from './Order.module.css';

function Order({
  id, cliente, fechaSolicitada, descripcion,
}) {
  const navigate = useNavigate();
  return (
    <div className={`${styles.order} ${scrollbarGray}`}>
      <div className={`${styles.infoContainer}`}>
        <div className={`${styles.text}`}>
          <span>Cliente:</span>
          {cliente}
        </div>
        <div className={`${styles.text}`}>
          <span>Fecha Solicitada:</span>
          {fechaSolicitada}
        </div>
        <div className={`${styles.text}`}>
          <span>Descripción:</span>
          {descripcion}
        </div>
      </div>
      <div className={`${styles.button}`}>
        <ArrowCircleRightOutlinedIcon
          style={{ fontSize: '3em' }}
          className={styles.arrowIcon}
          onClick={() => navigate(`/orden/${id}`)}
        />
      </div>
    </div>
  );
}

Order.propTypes = {
  id: PropTypes.string.isRequired,
  cliente: PropTypes.string.isRequired,
  fechaSolicitada: PropTypes.string.isRequired,
  descripcion: PropTypes.string.isRequired,
};

export default Order;
