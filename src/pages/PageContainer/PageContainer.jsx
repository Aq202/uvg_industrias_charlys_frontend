import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './PageContainer.module.css';
import NavBar from '../../components/NavBar/NavBar';
import Sidebar from '../../components/Sidebar/Sidebar';

function PageContainer({ children }) {
  const [displayMenu, setDisplayMenu] = useState(false);

  const onMenuChange = (value) => {
    setDisplayMenu(value);
  };

  return (
    <div className={styles.pageContainer}>
      <NavBar onMenuChange={onMenuChange} />
      <Sidebar displayMenu={displayMenu} />
      {children}
    </div>
  );
}

export default PageContainer;

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

PageContainer.defaultProps = {

};
