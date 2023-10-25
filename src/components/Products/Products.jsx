import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useApiMultipleImages from '@hooks/useApiMultipleImages';
import ProductsSlider from '@components/ProductsSlider';

import styles from './Products.module.css';

function Products({ products }) {
  const {
    getMultipleApiImages, result: resultImages,
  } = useApiMultipleImages();

  const tallas = ['2', '4', '6', '8', '10', '12', '14', '16', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'];
  const header = ['Talla', 'Cantidad'];
  const [totalCantidad, setTotalCantidad] = useState(0);
  const [productImages, setProductImages] = useState({});

  const [currProduct, setCurrProduct] = useState('');
  const [producto, setProducto] = useState({});

  const getProductImages = async () => {
    if (!products) return;

    const images = [];
    products.forEach((product) => {
      if (product.media?.length > 0) {
        images.push({ id: product.id, uri: product.media[0] });
      }
    });
    getMultipleApiImages(images);
  };

  useEffect(() => {
    if (!resultImages) return;
    setProductImages(() => resultImages);
  }, [resultImages]);

  useEffect(() => {
    if (!products) return;
    getProductImages();
    setCurrProduct(products[0].id);
  }, [products]);

  useEffect(() => {
    const actual = products.find((p) => p.id === currProduct);
    setProducto(actual);
    // if (actual) console.log(actual.id, productImages[actual.id]);
    // if (currProduct.length > 0 && resultImages) console.log(resultImages[currProduct]);
  }, [currProduct]);

  useEffect(() => {
    if (producto && producto.sizes) {
      const newTotalCantidad = producto.sizes.reduce((total, size) => (
        total + size.quantity
      ), 0);
      setTotalCantidad(newTotalCantidad);
    } else {
      setTotalCantidad(0);
    }
  }, [producto]);

  const handleCurrProduct = (selectedId) => {
    setCurrProduct(selectedId);
  };

  return (
    <div className={`${styles.productContainer}`}>
      {products
        && (
        <ProductsSlider
          products={products.map((item) => ({
            id: item.id,
            name: item.product,
            imageUrl: productImages?.[item.id] ?? null,
            type: item.type,
            organization: item.organization,
            colors: Array.isArray(item.colors)
              ? item.colors.map((color) => ({
                name: color.name,
                r: color.r,
                g: color.g,
                b: color.b,
              }))
              : [],
            loadingImage: productImages?.[item.id] === null,
          }))}
          onChange={handleCurrProduct}
        />
        )}
      <div className={`${styles.tableContainer}`}>
        {producto
          && (
            <table className={`${styles.tableProduct}`}>
              <thead>
                <tr className={`${styles.tableTrProduct}`}>
                  {header?.map((val) => (
                    <th key={val} className={`${styles.tableThProduct}`}>{val}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tallas.map((talla) => {
                  const size = producto.sizes
                    ? producto.sizes.find((s) => s.size === talla) : null;
                  const cantidad = size ? size.quantity : 0;
                  return (
                    <tr key={talla} className={`${styles.tableTrProduct}`}>
                      <td className={`${styles.tableTdProduct}`}>{talla}</td>
                      <td className={`${styles.tableTdProduct}`}>
                        {cantidad}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td className={`${styles.tableTotalProduct}`}><strong>Total</strong></td>
                  <td className={`${styles.tableTotalProduct}`}><strong>{totalCantidad}</strong></td>
                </tr>
              </tbody>
              <tfoot />
            </table>
          )}
      </div>
    </div>
  );
}

export default Products;

Products.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    product: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    media: PropTypes.arrayOf(PropTypes.string),
    organization: PropTypes.string.isRequired,
    colors: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        r: PropTypes.number.isRequired,
        g: PropTypes.number.isRequired,
        b: PropTypes.number.isRequired,
      }),
    ),
    sizes: PropTypes.arrayOf(
      PropTypes.shape({
        size: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        unit_price: PropTypes.number,
      }),
    ),
  })).isRequired,
};
