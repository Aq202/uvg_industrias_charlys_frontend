import React from 'react';
import PropTypes from 'prop-types';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { scrollbarGray } from '@styles/scrollbar.module.css';
import { Link } from 'react-router-dom';
import styles from './RequestedOrder.module.css';

function RequestedOrder({
  id, datePlaced, description,
}) {
  const date = new Date(datePlaced);
  return (
    <div className={`${styles.order} ${scrollbarGray}`}>
      <div className={`${styles.infoContainer}`}>
        <div className={`${styles.text}`}>
          <span>ID de la solicitud:</span>
          {id}
        </div>
        <div className={`${styles.text}`}>
          <span>Fecha de la solicitud:</span>
          {datePlaced ? `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}` : ''}
        </div>
        <div className={`${styles.text}`}>
          <span>Descripción:</span>
          {description}
        </div>
      </div>
      <div className={`${styles.button}`}>
        <Link to={`/solicitudOrden/${id}`} className={styles.arrowLink}>
          <ArrowCircleRightOutlinedIcon
            style={{ fontSize: '3em' }}
            className={styles.arrowIcon}
          />
        </Link>
      </div>
    </div>
  );
}

RequestedOrder.propTypes = {
  id: PropTypes.string.isRequired,
  datePlaced: PropTypes.string,
  description: PropTypes.string.isRequired,
};

RequestedOrder.defaultProps = {
  datePlaced: null,
};

export default RequestedOrder;
