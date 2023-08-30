/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './PageContainer.module.css';
import NavBar from '../../components/NavBar/NavBar';
import Sidebar from '../../components/Sidebar/Sidebar';

function PageContainer({ children }) {
  const [displayMenu, setDisplayMenu] = useState(false);

  const menuRef = useRef();

  const onMenuChange = () => {
    setDisplayMenu((val) => !val);
  };

  const handlePageClick = (e) => {
    if (!displayMenu) return;
    if (!menuRef?.current?.contains(e.target)) setDisplayMenu(false);
  };

  return (
    <div className={styles.pageContainer} onClick={handlePageClick}>
      <NavBar onMenuChange={onMenuChange} />
      <Sidebar displayMenu={displayMenu} menuRef={menuRef} />
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
