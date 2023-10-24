import React from 'react';
import { Route, Routes } from 'react-router-dom';
import styles from './Config.module.css';
import TabMenu from '../../../components/TabMenu/TabMenu';
import SizesList from '../../SizesList/SizesList';
import ColorsList from '../../ColorsList/ColorsList';

function Config() {
  return (
    <div className={styles.configPage}>
      <div className={styles.title}>
        <h1>Configuración</h1>
      </div>
      <div className={styles.content}>
        <TabMenu
          breakpoint="700px"
          options={[
            { text: 'Tallas', href: '' },
            { text: 'Colores', href: 'colores' },
          ]}
          className={styles.tabMenu}
        />
        <Routes>
          <Route path="/tallas" element={<SizesList />} />
          <Route path="/colores" element={<ColorsList />} />
          <Route path="" element={<SizesList />} />
        </Routes>
      </div>
    </div>
  );
}

export default Config;
