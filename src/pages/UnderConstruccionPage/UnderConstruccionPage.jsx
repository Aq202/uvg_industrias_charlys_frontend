import React from 'react';
// import PropTypes from 'prop-types';
import banner from '@assets/construction_banner.svg';
import styles from './UnderConstruccionPage.module.css';

function UnderConstruccionPage() {
  return (
    <div className={styles.underConstruccionPage}>
      <img src={banner} alt="Banner en construcción" className={styles.banner} />
      <h1 className={styles.title}>Página en construcción</h1>
    </div>
  );
}

export default UnderConstruccionPage;

UnderConstruccionPage.propTypes = {

};

UnderConstruccionPage.defaultProps = {

};
