import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
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
import {
  FaClipboardList as OrderListIcon,
  FaTasks as ProductionIcon,
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
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if (!token) return;

    const userData = getTokenPayload(token);
    setUserRole(userData?.role);
    setUserName(userData?.name);
  }, [token]);

  const adminItems = [
    {
      icon: <OrderListIcon className={styles.icon} />,
      text: 'Pedidos recibidos',
      url: '/orderList',
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
    {
      icon: <NewManualOrderRequestIcon className={styles.icon} />,
      text: 'Crear solicitud de pedido',
      url: '/solicitudOrden/nuevo',
    },
  ];

  const clientItems = [
    {
      icon: <NewOrderRequestIcon className={styles.icon} />,
      text: 'Nueva solicitud de pedido',
      url: '/solicitudOrden/nuevo',
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
    {
      icon: <FinishedOrdersIcon className={styles.icon} />,
      text: 'Órdenes finalizadas',
      url: '/orden/finalizadas',
    },
  ];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.title}>
        {`¡Bienvenido ${userName ?? ''}!`}
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
