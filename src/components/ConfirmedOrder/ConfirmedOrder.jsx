import React from 'react';
import PropTypes from 'prop-types';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { scrollbarGray } from '@styles/scrollbar.module.css';
import { Link } from 'react-router-dom';
import styles from './ConfirmedOrder.module.css';

function ConfirmedOrder({
  id, deadline, description, client, phase, link,
}) {
  const date = new Date(deadline);
  return (
    <div className={`${styles.order} ${scrollbarGray}`}>
      <div className={`${styles.infoContainer}`}>
        <div className={`${styles.text}`}>
          <span>ID de la orden:</span>
          {id}
        </div>
        {client && (
          <div className={`${styles.text}`}>
            <span>Cliente:</span>
            {client}
          </div>
        )}
        <div className={`${styles.text}`}>
          <span>Fecha límite de entrega:</span>
          {deadline ? `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}` : 'Sin fecha'}
        </div>
        <div className={`${styles.text}`}>
          <span>Descripción:</span>
          {description}
        </div>
        {phase && (
          <div className={`${styles.text}`}>
            <span>Fase:</span>
            {phase}
          </div>
        )}
      </div>
      <div className={`${styles.button}`}>
        <Link to={link} className={styles.arrowLink}>
          <ArrowCircleRightOutlinedIcon
            style={{ fontSize: '3em' }}
            className={styles.arrowIcon}
          />
        </Link>
      </div>
    </div>
  );
}

ConfirmedOrder.propTypes = {
  id: PropTypes.string.isRequired,
  deadline: PropTypes.string,
  description: PropTypes.string.isRequired,
  client: PropTypes.string,
  phase: PropTypes.string,
  link: PropTypes.string,
};

ConfirmedOrder.defaultProps = {
  deadline: null,
  client: null,
  phase: null,
  link: null,
};

export default ConfirmedOrder;
