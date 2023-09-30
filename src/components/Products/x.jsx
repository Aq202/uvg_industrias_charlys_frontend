import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import useToken from '@hooks/useToken';
import useApiMultipleImages from '@hooks/useApiMultipleImages';
import SubLoadingView from '@components/SubLoadingView/SubLoadingView';
import ProductModel from '@components/ProductModel/ProductModel';
import styles from './Products.module.css';

function Product({ id, size, quantity }) {
  const {
    callFetch: callFetchProduct,
    result: resultProduct,
    error: errorProduct,
    loading: loadingProduct,
  } = useFetch();

  const {
    getMultipleApiImages, result: resultImages,
  } = useApiMultipleImages();

  const tallas = ['2', '4', '6', '8', '10', '12', '14', '16', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'];
  const header = ['Talla', 'Cantidad'];
  const [totalCantidad, setTotalCantidad] = useState(0);
  const [productImages, setProductImages] = useState({});

  const token = useToken();

  useEffect(() => {
    if (!token) return;
    callFetchProduct({
      uri: `${serverHost}/product/model/${id}`,
      headers: {
        authorization: token,
      },
    });
  }, [token]);

  const getProductImages = async () => {
    const images = [];
    images.push({ id: resultProduct.id, uri: resultProduct.media[0] });
    getMultipleApiImages(images);
  };

  useEffect(() => {
    if (!resultImages) return;
    setProductImages(() => resultImages);
  }, [resultImages]);

  useEffect(() => {
    if (!resultProduct) return;
    getProductImages();
  }, [resultProduct]);

  useEffect(() => {
    const newTotalCantidad = tallas.reduce((total, talla) => (
      talla === size ? total + quantity : total), 0);

    setTotalCantidad(newTotalCantidad);
  }, [quantity, size]);

  return (
    <div className={`${styles.productContainer}`}>
      {resultProduct
      && (
        <div className={`${styles.product}`}>
          {errorProduct && 'Ocurrió un error al cargar el producto.'}
          {loadingProduct && <SubLoadingView />}
          <ProductModel
            key={resultProduct.id}
            name={resultProduct.details}
            imageUrl={productImages[id]}
            type={resultProduct.description}
            organization={resultProduct.client}
            colors={resultProduct.colors}
          />
          <div className={`${styles.tableContainer}`}>
            <table className={`${styles.tableProduct}`}>
              <thead>
                <tr className={`${styles.tableTrProduct}`}>
                  {header?.map((val) => (
                    <th className={`${styles.tableThProduct}`}>{val}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tallas.slice(0, Math.ceil(tallas.length / 2)).map((talla) => (
                  <tr className={`${styles.tableTrProduct}`}>
                    <td className={`${styles.tableTdProduct}`}>{talla}</td>
                    <td className={`${styles.tableTdProduct}`}>{size === talla ? quantity : 0}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot />
            </table>
            <table className={`${styles.tableProduct}`}>
              <thead>
                <tr className={`${styles.tableTrProduct}`}>
                  {header?.map((val) => (
                    <th className={`${styles.tableThProduct}`}>{val}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tallas.slice(Math.ceil(tallas.length / 2)).map((talla) => (
                  <tr className={`${styles.tableTrProduct}`}>
                    <td className={`${styles.tableTdProduct}`}>{talla}</td>
                    <td className={`${styles.tableTdProduct}`}>{size === talla ? quantity : 0}</td>
                  </tr>
                ))}
                <tr>
                  <td className={`${styles.tableTotalProduct}`}><strong>Total</strong></td>
                  <td className={`${styles.tableTotalProduct}`}><strong>{totalCantidad}</strong></td>
                </tr>
              </tbody>
              <tfoot />
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;

Product.propTypes = {
  id: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
};
