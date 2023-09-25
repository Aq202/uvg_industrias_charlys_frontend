import React from 'react';
import PropTypes from 'prop-types';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { scrollbarGray } from '@styles/scrollbar.module.css';
import styles from './ConfirmedOrder.module.css';

function ConfirmedOrder({
  id, deadline, description,
}) {
  const date = new Date(deadline);
  return (
    <div className={`${styles.order} ${scrollbarGray}`}>
      <div className={`${styles.infoContainer}`}>
        <div className={`${styles.text}`}>
          <span>ID de la orden:</span>
          {id}
        </div>
        <div className={`${styles.text}`}>
          <span>Fecha límite de entrega:</span>
          {deadline ? `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}` : ''}
        </div>
        <div className={`${styles.text}`}>
          <span>Descripción:</span>
          {description}
        </div>
      </div>
      <div className={`${styles.button}`}>
        <ArrowCircleRightOutlinedIcon
          style={{ fontSize: '3em' }}
          className={styles.arrowIcon}
        />
      </div>
    </div>
  );
}

ConfirmedOrder.propTypes = {
  id: PropTypes.string.isRequired,
  deadline: PropTypes.string,
  description: PropTypes.string.isRequired,
};

ConfirmedOrder.defaultProps = {
  deadline: null,
};

export default ConfirmedOrder;
