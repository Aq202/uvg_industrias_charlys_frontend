/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import logoutIcon from '@assets/logoutIcon.svg';
import getTokenPayload from '@helpers/getTokenPayload';
import {
  MdInventory2 as InventoryIcon,
  MdAddShoppingCart as NewOrderRequestIcon,
  MdShoppingCartCheckout as OrdersRequestIcon,
  MdOutlineShoppingCart as ConfirmedOrdersIcon,
  MdOutlineCheckCircle as FinishedOrdersIcon,
  MdOutlineAddTask as NewManualOrderRequestIcon,
} from 'react-icons/md';
import {
  GiOrganigram as OrganizationsIcon,
} from 'react-icons/gi';
import { HiMiniWrenchScrewdriver as ConfigureIcon } from 'react-icons/hi2';
import { IoHomeSharp as HomeIcon } from 'react-icons/io5';
import {
  FaClipboardList as OrderListIcon,
  FaTasks as ProductionIcon,
  FaShoppingBasket as ProductsIcon,
  FaClipboardCheck as FinishedOrderIcon,
} from 'react-icons/fa';
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
          <SidebarItem path="/" iconItem={<HomeIcon />} text="Inicio" onClick={closeMenu} />
          <SidebarItem path="/solicitudOrden" iconItem={<OrderListIcon />} text="Pedidos recibidos" onClick={closeMenu} />
          <SidebarItem path="/orden/finalizadas" iconItem={<FinishedOrderIcon />} text="Órdenes finalizadas" onClick={closeMenu} />
          <SidebarItem path="/inventario" iconItem={<InventoryIcon />} text="Inventario" onClick={closeMenu} />
          <SidebarItem path="/organizaciones" iconItem={<OrganizationsIcon />} text="Organizaciones" onClick={closeMenu} />
          <SidebarItem path="/produccion" iconItem={<ProductionIcon />} text="Producción" onClick={closeMenu} />
          <SidebarItem path="/solicitudOrden/nuevo" iconItem={<NewManualOrderRequestIcon />} text="Realizar nuevo pedido manualmente" onClick={closeMenu} />
          <SidebarItem path="/config" iconItem={<ConfigureIcon />} text="Configuración" onClick={closeMenu} />
        </>
        )}
        {role === consts.role.client && (
          <>
            <SidebarItem path="/" iconItem={<HomeIcon />} text="Inicio" onClick={closeMenu} />

            <SidebarItem path="/solicitudOrden/nuevo" iconItem={<NewOrderRequestIcon />} text="Nuevo pedido" onClick={closeMenu} />
            <SidebarItem path="/productos" iconItem={<ProductsIcon />} text="Productos" onClick={closeMenu} />
            <SidebarItem path="/solicitudOrden" iconItem={<OrdersRequestIcon />} text="Solicitudes de órden" />
            <SidebarItem path="/orden" iconItem={<ConfirmedOrdersIcon />} text="Órdenes confirmadas" />
            <SidebarItem path="/orden/finalizadas" iconItem={<FinishedOrdersIcon />} text="Órdenes finalizadas" onClick={closeMenu} />
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
