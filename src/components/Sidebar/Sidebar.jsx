import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import logoutIcon from '@assets/logoutIcon.svg';
import getTokenPayload from '@helpers/getTokenPayload';
import styles from './Sidebar.module.css';
import SidebarItem from '../SidebarItem/SidebarItem';
import useToken from '../../hooks/useToken';
import consts from '../../helpers/consts';
import useLogout from '../../hooks/useLogout';
import LoadingView from '../LoadingView/LoadingView';

function Sidebar({ displayMenu, menuRef, closeMenu }) {
  const token = useToken();

  const [role, setRole] = useState(null);
  const [showLoading, setShowLoading] = useState(false);

  const logout = useLogout();

  useEffect(() => {
    if (!token) return;
    // Obtener role del usuario
    const { role: userRole } = getTokenPayload(token);
    setRole(userRole);
  }, [token]);

  const handleLogout = () => {
    if (closeMenu) closeMenu();
    logout();
    setShowLoading(true);
  };
  return (
    <nav className={`${styles.sideMenu} ${!displayMenu ? styles.hideMenu : ''}`} ref={menuRef}>
      <p className={styles.menuTitle}>Menú</p>
      <div className={styles.optionsContainer}>
        {role === consts.role.admin && (
        <>
          <SidebarItem path="/orden" iconUrl={logoutIcon} text="Pedidos recibidos" onClick={closeMenu} />
          <SidebarItem path="/inventario" iconUrl={logoutIcon} text="Inventario" onClick={closeMenu} />
          <SidebarItem path="/organizaciones" iconUrl={logoutIcon} text="Organizaciones" onClick={closeMenu} />
        </>
        )}
        {role === consts.role.client && (
          <>
            <SidebarItem path="/orden/nuevo" iconUrl={logoutIcon} text="Nuevo pedido" onClick={closeMenu} />
            <SidebarItem path="/productos" iconUrl={logoutIcon} text="Productos" onClick={closeMenu} />
          </>
        )}
        <SidebarItem path="#" iconUrl={logoutIcon} text="Salir" onClick={handleLogout} />
      </div>
      {showLoading && <LoadingView />}
    </nav>
  );
}

export default Sidebar;

Sidebar.propTypes = {
  displayMenu: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  menuRef: PropTypes.any,
  closeMenu: PropTypes.func.isRequired,
};

Sidebar.defaultProps = {
  displayMenu: false,
  menuRef: null,
};
