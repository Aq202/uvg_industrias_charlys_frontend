import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import styles from './PruebasProducto.module.css';
import ProductsSlider from '../../components/ProductsSlider/ProductsSlider';
import SelectProductUnitsTable from '../../components/SelectProductUnitsTable/SelectProductUnitsTable';
import OrderProgressBar from '../../components/OrderProgressBar/OrderProgressBar';

const products = [
  {
    id: 'producto1',
    name: 'Pantalón de lona1',
    type: 'Pantalón',
    colors: [
      {
        name: 'Azul',
        r: 0,
        g: 0,
        b: 255,
      },
    ],
    organization: 'Liceo Guatemala',
    imageUrl:
      'https://spirituniforms.com/cdn/shop/products/ChumpaCampoalegre_2ee3e848-c25d-4b85-aff0-be90e08c50c4_1000x1000.jpg?v=1682183750',
  },
  {
    id: 'producto2',
    name: 'Pantalón de lona2',
    type: 'Pantalón',
    colors: [
      {
        name: 'Azul',
        r: 0,
        g: 0,
        b: 255,
      },
    ],
    organization: 'Liceo Guatemala',
    imageUrl:
      'https://spirituniforms.com/cdn/shop/products/ChumpaCampoalegre_2ee3e848-c25d-4b85-aff0-be90e08c50c4_1000x1000.jpg?v=1682183750',
  },
  {
    id: 'producto3',
    name: 'Pantalón de lona3',
    type: 'Pantalón',
    colors: [
      {
        name: 'Azul',
        r: 0,
        g: 0,
        b: 255,
      },
    ],
    organization: 'Liceo Guatemala',
    imageUrl:
      'https://spirituniforms.com/cdn/shop/products/ChumpaCampoalegre_2ee3e848-c25d-4b85-aff0-be90e08c50c4_1000x1000.jpg?v=1682183750',
  },

];
function PruebasProducto() {
  // eslint-disable-next-line no-unused-vars
  const [currentProduct, setCurrentProduct] = useState();

  return (
    <div className={styles.PruebasProducto}>
      <div className={styles.container}>
        <h1>Detalles</h1>
        <ProductsSlider products={products} onChange={setCurrentProduct} />
        <br />
        <SelectProductUnitsTable />

        <br />
        <br />
        <OrderProgressBar stage={2} />
      </div>
    </div>
  );
}

export default PruebasProducto;

PruebasProducto.propTypes = {

};

PruebasProducto.defaultProps = {

};
