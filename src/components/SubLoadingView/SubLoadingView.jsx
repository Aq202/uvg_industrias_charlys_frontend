import React from 'react';
// import PropTypes from 'prop-types';
import styles from './SubLoadingView.module.css';
import Spinner from '../Spinner/Spinner';

function SubLoadingView() {
  return (
    <div className={styles.subLoadingView}>
      <Spinner className={styles.spinner} />
    </div>
  );
}

export default SubLoadingView;

SubLoadingView.propTypes = {

};

SubLoadingView.defaultProps = {

};
