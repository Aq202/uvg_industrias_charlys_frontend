import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styles from './ConfirmedOrderCustomerPage.module.css';
import ProductModel from '../../components/ProductModel/ProductModel';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import useApiMultipleImages from '../../hooks/useApiMultipleImages';
import Spinner from '../../components/Spinner/Spinner';
import TextArea from '../../components/TextArea/TextArea';
import InputNumber from '../../components/InputNumber/InputNumber';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

function ConfirmedOrderCustomerPage() {
  const { idOrder } = useParams();
  const token = useToken();
  const {
    getMultipleApiImages, result: resultImages,
  } = useApiMultipleImages();
  const {
    callFetch: getSizes, result: resultSizes, error: errorSizes, loading: loadingSizes,
  } = useFetch();
  const {
    callFetch: getOrder, result: resultOrder, error: errorOrder, loading: loadingOrder,
  } = useFetch();

  const [sizes, setSizes] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [errors, setErrors] = useState({});

  const getOrderDetails = async () => {
    getOrder({
      uri: `${serverHost}/order/${idOrder}`,
      headers: { authorization: token },
      method: 'GET',
    });
  };

  const getProductImages = async () => {
    const media = [];
    resultOrder.detail.forEach((product) => {
      media?.push({ id: product?.id, uri: product?.media });
    });
    getMultipleApiImages(media);
  };

  const getAllSizes = async (product) => {
    getSizes({
      uri: `${serverHost}/generalInfo/size`,
      headers: { authorization: token },
    });
    const sizesArray = [];
    resultSizes?.forEach((size) => {
      const sizeObject = {
        size: size.size,
        quantity: 0,
      };
      sizesArray.push(sizeObject);
    });
    product.sizes.forEach((size) => {
      const index = sizesArray.findIndex((element) => element.size === size.size);
      sizesArray[index].quantity = size.quantity;
    });
    setSizes(() => sizesArray);
  };

  const clearError = (e) => {
    setErrors((lastVal) => ({ ...lastVal, [e.target.name]: null }));
  };

  useEffect(() => {
    if (!idOrder) return;
    getOrderDetails();
    resultOrder?.detail.forEach((product) => {
      getAllSizes(product);
    });
    getProductImages();
  }, []);

  useEffect(() => {
    if (!resultImages) return;
    setProductImages(() => resultImages);
  }, [resultImages]);

  return (
    <div className={styles.confirmedOrderCustomerPage}>
      {errorOrder && <NotFoundPage />}
      {!errorOrder && loadingOrder && <Spinner />}
      {!errorOrder && !loadingOrder && resultOrder && (
        <div className={styles.formContainer}>
          <h3 className={styles.sectionTitle}>Productos </h3>
          <div className={styles.selectedProductsGrid}>
            {resultOrder?.detail.map((product) => (
              <div className={styles.selectedProductContainer} key={product.id}>
                <ProductModel
                  id={product.idProductModel}
                  name={product.product}
                  imageUrl={productImages[product.id]}
                  type={product.type}
                  colors={product.colors}
                />
                <div className={styles.sizesTable}>
                  <p className={styles.tableHeader}>
                    Cantidades de cada talla:
                  </p>
                  {errorSizes && <p className={styles.error}>{errorSizes}</p>}
                  {loadingSizes && <Spinner />}
                  {sizes?.length > 0 && sizes.map((element) => (
                    <div className={styles.tableRow}>
                      <p className={styles.tableItem}>{`${element.size}:`}</p>
                      <InputNumber
                        value={element.quantity}
                        readOnly
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Descripción del pedido</h3>
            <TextArea
              name="description"
              className={styles.detailsTextArea}
              value={resultOrder.description}
              error={errors.description}
              onFocus={clearError}
              readOnly
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfirmedOrderCustomerPage;
