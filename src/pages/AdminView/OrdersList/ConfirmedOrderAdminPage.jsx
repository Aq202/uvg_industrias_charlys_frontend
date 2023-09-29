/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { scrollbarGray } from '@styles/scrollbar.module.css';
import moment from 'moment';
import styles from './ConfirmedOrderAdminPage.module.css';
import useFetch from '../../../hooks/useFetch';
import { serverHost } from '../../../config';
import useToken from '../../../hooks/useToken';
import useApiMultipleImages from '../../../hooks/useApiMultipleImages';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';
import ProductsSlider from '../../../components/ProductsSlider/ProductsSlider';
import ImageViewer from '../../../components/ImageViewer/ImageViewer';
import Table from '../../../components/Table/Table';
import TableRow from '../../../components/TableRow/TableRow';
import LoadingView from '../../../components/LoadingView/LoadingView';

function ConfirmedOrderAdminPage() {
  const { idOrder } = useParams();
  const token = useToken();
  const {
    getMultipleApiImages, result: resultImagesProduct,
  } = useApiMultipleImages();
  const {
    callFetch: getSizes, result: resultSizes,
  } = useFetch();
  const {
    callFetch: getOrder, result: resultOrder, error: errorOrder, loading: loadingOrder,
  } = useFetch();

  const [sizes, setSizes] = useState([]);
  const [sizeswithValues, setSizesWithValues] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [productSelected, setProductSelected] = useState(null);

  const getOrderDetails = async () => {
    getOrder({
      uri: `${serverHost}/order/${idOrder}`,
      headers: { authorization: token },
      method: 'GET',
    });
  };

  const getAllSizes = async () => {
    getSizes({
      uri: `${serverHost}/generalInfo/size`,
      headers: { authorization: token },
    });
  };

  const getProductImages = async () => {
    const media = [];
    resultOrder?.detail.forEach((product) => {
      media?.push({ id: product?.id, uri: product?.media });
    });
    getMultipleApiImages(media);
  };

  const getSizesByProduct = async (idProduct) => {
    const sizesArray = [];
    resultSizes?.forEach((size) => {
      const sizeObject = {
        size: size.size,
        quantity: 0,
        unit_price: 'N/A',
      };
      sizesArray.push(sizeObject);
    });
    const product = resultOrder?.detail?.find((element) => element?.id === idProduct);
    product?.sizes?.forEach((size) => {
      const index = sizesArray.findIndex((element) => element.size === size?.size);
      if (index === -1) return;
      sizesArray[index].quantity = size?.quantity;
      sizesArray[index].unit_price = size?.unit_price || 'Pendiente';
    });
    setSizes(() => sizesArray);
    setSizesWithValues(() => sizesArray.filter((size) => size.quantity > 0));
  };

  useEffect(() => {
    if (!idOrder) return;
    getOrderDetails();
    getAllSizes();
  }, [idOrder]);

  useEffect(() => {
    if (!productSelected) return;
    getSizesByProduct(productSelected);
  }, [productSelected]);

  useEffect(() => {
    if (!resultImagesProduct) return;
    setProductImages(() => resultImagesProduct);
  }, [resultImagesProduct]);

  useEffect(() => {
    if (!resultOrder) return;
    if (!resultOrder?.detail) return;
    setProductSelected(() => resultOrder?.detail[0]?.id);
    getProductImages();
  }, [resultOrder]);

  return (
    <div>
      {errorOrder && <NotFoundPage />}
      {!errorOrder && loadingOrder && <LoadingView />}
      {!errorOrder && !loadingOrder && resultOrder && (
      <div className={styles.confirmedOrderAdminPage}>
        <h1 className={styles.title}> Orden Confirmada </h1>
        <div className={styles.formContainer}>
          <div className={styles.orderInfo}>
            <div className={styles.orderClient}>
              <div className={styles.name}>
                <p>Cliente:</p>
              &nbsp;
                <p>{resultOrder?.clientOrganization}</p>
              </div>
              <div className={styles.name}>
                <p>Fecha de entrega:</p>
              &nbsp;
                <p>{ resultOrder?.deadline ? moment(resultOrder?.deadline).format('DD/MM/YYYY') : 'N/A'}</p>
              </div>
            </div>
            <div className={styles.name}>
              <p>Descripción:</p>
              &nbsp;
              <p>{resultOrder?.description}</p>
            </div>
          </div>
          {!resultOrder?.detail && (
            <h3 className={styles.sectionTitle}>No hay productos</h3>
          )}
          {resultOrder?.detail?.length > 0 && (
            <h3 className={styles.sectionTitle}>Productos</h3>
          )}

          {resultOrder?.detail?.map((product) => (
            <div className={styles.selectedProductsGrid}>
              <div className={styles.selectedProductContainer} key={product.id}>
                <ProductsSlider
                  products={[
                    {
                      key: product.id,
                      id: product.id,
                      name: product.product,
                      imageUrl: productImages[product.id],
                      type: product.type,
                      colors: product.colors,
                      loadingImage: false,
                    },
                  ]}
                  onChange={(id) => setProductSelected(id)}
                />
              </div>
              <div className={styles.productInfo}>
                <div className={styles.name}>
                  <p>Producto:</p>
                          &nbsp;
                  <p>
                    {resultOrder?.detail?.find((element) => element.id === productSelected)?.product}
                  </p>
                </div>
                <div className={styles.details}>
                  <a href={`/producto/${productSelected}`}>
                    Ver detalles del producto
                  </a>
                </div>
              </div>
            </div>
          ))}

          {resultOrder?.detail?.length > 0 && (
            <div className={styles.sizes}>

              <h3 className={styles.sectionTitle}>Tallas</h3>
              <Table
                header={['Talla', 'Cantidad', 'Precio']}
                loading={loadingOrder}
                showCheckbox={false}
                breakPoint="450px"
                maxCellWidth="140px"
              >
                {sizes?.map((size) => (
                  sizeswithValues?.find((element) => element.size === size.size)
                    ? (
                      <TableRow key={size.size} id={size.size}>
                        <td className={styles.red}>{size.size}</td>
                        <td className={styles.red}>{size.quantity}</td>
                        <td className={styles.red}>{size.unit_price}</td>
                      </TableRow>
                    )
                    : (
                      <TableRow key={size.size} id={size.size}>
                        <td>{size.size}</td>
                        <td>{size.quantity}</td>
                        <td>{size.unit_price}</td>
                      </TableRow>
                    )
                ))}
              </Table>
            </div>
          )}

          <div className={styles.section}>
            <div className={`${styles.divFile} ${scrollbarGray}`}>
              {resultOrder?.media ? (
                <div className={styles.imageViewerContainer}>
                  <ImageViewer images={resultOrder?.media} />
                </div>
              ) : (
                <p className={styles.noImagesMessage}>No hay recursos multimedia adjuntos.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default ConfirmedOrderAdminPage;
