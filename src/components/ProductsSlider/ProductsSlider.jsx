import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { AiOutlineLeft as LeftArrow } from 'react-icons/ai';
import { scrollbarGray } from '@styles/scrollbar.module.css';
import styles from './ProductsSlider.module.css';
import ProductModel from '../ProductModel/ProductModel';
import useCount from '../../hooks/useCount';

/**
 *
 * @param products. Arreglo con los productos a mostrar.
 * El arreglo debe contener objetos con la estructura:
 * {
 *  id: id del producto,
    name: nombre del producto,
    imageUrl: url de la imágen del producto,
    type: tipo (texto),
    organization: organización (texto),
    colors: [
      {
        name: nombre del color,
        r: 0-255,
        g: 0-255,
        b: 0-255,
      },
    ],
    loadingImage: boolean. Indica si la imagen del producto aún está cargando.,
  }
 * @param onChange. Function. Callback que se ejecuta al cambiar de producto y devuelve como
 * parámetro el id del producto seleccionado.
 * @param resetIndex trigger que coloca el producto seleccionado en 0.
 * @param onDelete. Callback opcional a una función para eliminar el producto de un arreglo u objeto
 */
function ProductsSlider({
  products, onChange, resetIndex, onDelete,
}) {
  const {
    count, next, previous, setCount,
  } = useCount(null, 0, products.length - 1);

  const sliderRef = useRef();
  const productItemsRef = useRef([]);

  useEffect(() => {
    if (count === null) return;
    productItemsRef.current[count].scrollIntoView();
    if (onChange) onChange(products[count].id);
  }, [count]);

  useEffect(() => {
    if (resetIndex !== null) setCount(null);
  }, [resetIndex]);

  useEffect(() => {
    if (!products) return;

    if (products.length === count) setCount(products.length - 1);
  }, [products]);

  return (
    <div className={styles.productsSlider}>
      <LeftArrow className={styles.arrowIcon} onClick={previous} />
      <div className={styles.sliderContainer}>
        <div className={`${styles.slider} ${scrollbarGray}`} ref={sliderRef}>
          {products?.sort((p) => p.quantity).map((product, index) => (
            <ProductModel
              key={product.id}
              itemRef={(ref) => {
                productItemsRef.current[index] = ref;
              }}
              className={`${styles.productModel} ${count === index || (count === null && index === 0) ? styles.currentProduct : ''}`}
              name={product.name}
              type={product.type}
              colors={product.colors}
              imageUrl={product.imageUrl}
              organization={product.organization}
              loadingImage={product.loadingImage}
              onClick={() => setCount(index)}
              onDelete={() => onDelete(product.id)}
            />
          ))}
        </div>
      </div>
      <LeftArrow className={`${styles.arrowIcon} ${styles.rightArrow}`} onClick={next} />
    </div>
  );
}

export default ProductsSlider;

ProductsSlider.propTypes = {
  onChange: PropTypes.func,
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    type: PropTypes.string.isRequired,
    organization: PropTypes.string,
    colors: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        r: PropTypes.number.isRequired,
        g: PropTypes.number.isRequired,
        b: PropTypes.number.isRequired,
      }),
    ),
    loadingImage: PropTypes.bool,
  })),
  resetIndex: PropTypes.number,
  onDelete: PropTypes.func,
};

ProductsSlider.defaultProps = {
  onChange: null,
  products: null,
  resetIndex: null,
  onDelete: null,
};
