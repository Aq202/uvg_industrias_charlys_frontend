import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import logoutIcon from '@assets/logoutIcon.svg';
import getTokenPayload from '@helpers/getTokenPayload';
import styles from './Sidebar.module.css';
import SidebarItem from '../SidebarItem/SidebarItem';
import useToken from '../../hooks/useToken';
import consts from '../../helpers/consts';
import useLogout from '../../hooks/useLogout';

function Sidebar({ displayMenu }) {
  const token = useToken();

  const [role, setRole] = useState(null);

  const logout = useLogout();

  useEffect(() => {
    if (!token) return;
    // Obtener role del usuario
    const { role: userRole } = getTokenPayload(token);
    setRole(userRole);
  }, [token]);

  const handleLogout = () => {
    logout();
  };
  return (
    <nav className={`${styles.sideMenu} ${!displayMenu ? styles.hideMenu : ''}`}>
      <p className={styles.menuTitle}>Menú</p>
      <div className={styles.optionsContainer}>
        {role === consts.role.admin && (
        <>
          <SidebarItem path="/orden" iconUrl={logoutIcon} text="Pedidos recibidos" />
          <SidebarItem path="/inventario" iconUrl={logoutIcon} text="Inventario" />
          <SidebarItem path="/organizaciones" iconUrl={logoutIcon} text="Organizaciones" />
          <SidebarItem path="#" iconUrl={logoutIcon} text="Salir" onClick={handleLogout} />
        </>
        )}
        {role === consts.role.client && (
          <SidebarItem path="/newOrderRequest" iconUrl={logoutIcon} text="Nuevo pedido" />
        )}
      </div>
    </nav>
  );
}

export default Sidebar;

Sidebar.propTypes = {
  displayMenu: PropTypes.bool,
};

Sidebar.defaultProps = {
  displayMenu: false,
};
