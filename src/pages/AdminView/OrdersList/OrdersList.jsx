import React from 'react';
import Searcher from '@components/Searcher/Searcher';
import Order from '@components/Order/Order';
import NavBar from '@components/NavBar/NavBar';
import styles from './OrdersList.module.css';

function OrdersList() {
  return (
    <div className={`${styles.OrdersList}`}>
      <header>
        <NavBar loggedIn />
      </header>
      <main>
        <div className={`${styles.top}`}>
          <span className={`${styles.title}`}>Lista de solicitudes de pedidos</span>
          <Searcher className={`${styles.search}`} />
        </div>
        <div className={`${styles.orders}`}>
          <Order cliente="Fundación Kinal" fechaSolicitada="24/02/2023" descripcion="5 playeras talla S" />
          <Order cliente="Fundación Kinal" fechaSolicitada="24/02/2023" descripcion="5 playeras talla S" />
          <Order cliente="Fundación Kinal" fechaSolicitada="24/02/2023" descripcion="5 playeras talla S" />
        </div>
      </main>
    </div>
  );
}

export default OrdersList;