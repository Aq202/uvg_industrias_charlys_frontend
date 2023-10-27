import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import {
  MdInventory2 as InventoryIcon,
  MdAddShoppingCart as NewOrderRequestIcon,
  MdShoppingCartCheckout as OrdersRequestIcon,
  MdOutlineShoppingCart as ConfirmedOrdersIcon,
} from 'react-icons/md';
import {
  GiOrganigram as OrganizationsIcon,
} from 'react-icons/gi';
import {
  FaClipboardList as OrderListIcon,
  FaTasks as ProductionIcon,
  FaUsersCog as UserGroupIcon,
  FaShoppingBasket as ProductsIcon,
} from 'react-icons/fa';
import useToken from '@hooks//useToken';
import getTokenPayload from '@helpers/getTokenPayload';
import consts from '@helpers/consts';
import styles from './Home.module.css';

function Home() {
  const token = useToken();
  // const navigate = useNavigate();

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (!token) return;

    const userData = getTokenPayload(token);
    if (userData?.role) setUserRole(userData?.role);
  }, [token]);

  const adminItems = [
    {
      icon: <OrderListIcon className={styles.icon} />,
      text: 'Pedidos recibidos',
      url: '/orderList',
    },
    {
      icon: <UserGroupIcon className={styles.icon} />,
      text: 'Administración de usuarios',
      url: '',
    },
    {
      icon: <InventoryIcon className={styles.icon} />,
      text: 'Inventario',
      url: '/inventario',
    },
    {
      icon: <OrganizationsIcon className={styles.icon} />,
      text: 'Organizaciones',
      url: '/organizaciones',
    },
    {
      icon: <ProductionIcon className={styles.icon} />,
      text: 'Producción',
      url: '/produccion',
    },
  ];

  const clientItems = [
    {
      icon: <NewOrderRequestIcon className={styles.icon} />,
      text: 'Nueva solicitud de pedido',
      url: '/orden/nuevo',
    },
    {
      icon: <ProductsIcon className={styles.icon} />,
      text: 'Productos',
      url: '/productos',
    },
    {
      icon: <OrdersRequestIcon className={styles.icon} />,
      text: 'Solicitudes de órdenes realizadas',
      url: '/solicitudOrden',
    },
    {
      icon: <ConfirmedOrdersIcon className={styles.icon} />,
      text: 'Órdenes confirmadas',
      url: '/orden',
    },
  ];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.title}>
        Panel de trabajo
      </div>
      <div className={styles.itemsContainer}>
        {userRole === consts.role.admin
        && (
          <>
            {adminItems.map((item) => (
              <NavLink to={item.url} className={styles.linkContainer}>
                <div className={styles.item}>
                  {item.icon}
                  <span className={styles.text}>{item.text}</span>
                </div>
              </NavLink>
            ))}
          </>
        )}
        {userRole === consts.role.client
          && (
            <>
              {clientItems.map((item) => (
                <NavLink to={item.url} className={styles.linkContainer}>
                  <div className={styles.item}>
                    {item.icon}
                    <span className={styles.text}>{item.text}</span>
                  </div>
                </NavLink>
              ))}
            </>
          )}
      </div>
    </div>
  );
}

export default Home;
