import React from 'react';
import PropTypes from 'prop-types';
import styles from './UnloggedPageContainer.module.css';

function UnloggedPageContainer({ children }) {
  return (
    <div className={styles.unloggedPageContainer}>
      <div className={styles.pageContent}>{children}</div>
    </div>
  );
}

export default UnloggedPageContainer;

UnloggedPageContainer.propTypes = {
  children: PropTypes.node,
};

UnloggedPageContainer.defaultProps = {
  children: null,
};
