import React from 'react';
import PropTypes from 'prop-types';
import styles from './SubLoadingView.module.css';
import Spinner from '../Spinner/Spinner';

function SubLoadingView({ className }) {
  return (
    <div className={`${styles.subLoadingView} ${className}`}>
      <Spinner className={styles.spinner} />
    </div>
  );
}

export default SubLoadingView;

SubLoadingView.propTypes = {
  className: PropTypes.string,
};

SubLoadingView.defaultProps = {
  className: '',
};
