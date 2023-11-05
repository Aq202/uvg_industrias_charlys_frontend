import React from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './Thumbnails.module.css';

function Thumbanils({
  img, onDeleteClick, id, className,
}) {
  return (
    <div className={`${styles.thumbnails} ${className}`}>
      <div className={`${styles.image}`}>
        <img src={img} alt="Imagen" />
      </div>
      <div className={`${styles.delete}`} name="DeleteIcon">
        <DeleteIcon onClick={(e) => onDeleteClick(e, id)} />
      </div>
    </div>
  );
}

Thumbanils.propTypes = {
  img: PropTypes.string.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Thumbanils.defaultProps = {
  className: '',
};

export default Thumbanils;
