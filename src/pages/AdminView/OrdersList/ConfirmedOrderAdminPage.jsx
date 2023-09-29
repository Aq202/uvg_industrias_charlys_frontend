/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import styles from './ConfirmedOrderAdminPage.module.css';
import useFetch from '../../../hooks/useFetch';
import { serverHost } from '../../../config';
import useToken from '../../../hooks/useToken';
import useApiMultipleImages from '../../../hooks/useApiMultipleImages';
import TextArea from '../../../components/TextArea/TextArea';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';
import ProductsSlider from '../../../components/ProductsSlider/ProductsSlider';
import ImageViewer from '../../../components/ImageViewer/ImageViewer';
import Table from '../../../components/Table/Table';
import TableRow from '../../../components/TableRow/TableRow';
import LoadingView from '../../../components/LoadingView/LoadingView';

function ConfirmedOrderAdminPage() {
  const { idOrder } = useParams();
  const token = useToken();
  const navigate = useNavigate();
  const {
    getMultipleApiImages, result: resultImagesProduct,
  } = useApiMultipleImages();
  const {
    getMultipleApiImages: getMultipleApiImagesOrder, result: resultImagesOrder,
  } = useApiMultipleImages();
  const {
    callFetch: getSizes, result: resultSizes, error: errorSizes, loading: loadingSizes,
  } = useFetch();
  const {
    callFetch: getOrder, result: resultOrder, error: errorOrder, loading: loadingOrder,
  } = useFetch();

  const [sizes, setSizes] = useState([]);
  const [sizeswithValues, setSizesWithValues] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [orderImages, setOrderImages] = useState({});
  const [errors, setErrors] = useState({});
  const [productSelected, setProductSelected] = useState(null);

  const getOrderDetails = async () => {
    getOrder({
      uri: `${serverHost}/order/${idOrder}`,
      headers: { authorization: token },
      method: 'GET',
    });
  };

  const getProductImages = async () => {
    const media = [];
    resultOrder?.detail.forEach((product) => {
      media?.push({ id: product?.id, uri: product?.media });
    });
    getMultipleApiImagesOrder(media);
  };

  const getOrderImages = async () => {
    const media = [];
    resultOrder?.media?.forEach((image) => {
      media?.push({ id: image?.id, uri: image?.uri });
    });
    getMultipleApiImages(media);
  };

  const getAllSizes = async () => {
    getSizes({
      uri: `${serverHost}/generalInfo/size`,
      headers: { authorization: token },
    });
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
    const product = resultOrder?.detail?.find((element) => element.id === idProduct);
    product?.sizes?.forEach((size) => {
      const index = sizesArray.findIndex((element) => element.size === size.size);
      sizesArray[index].quantity = size.quantity;
      sizesArray[index].unit_price = size.unit_price || 'Pendiente';
    });
    setSizes(() => sizesArray);
    setSizesWithValues(() => sizesArray.filter((size) => size.quantity > 0));
  };

  const clearError = (e) => {
    setErrors((lastVal) => ({ ...lastVal, [e.target.name]: null }));
  };

  useEffect(() => {
    if (!idOrder) return;
    getOrderDetails();
    getAllSizes();
    getProductImages();
    getOrderImages();
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
    if (!resultImagesOrder) return;
    setOrderImages(() => resultImagesOrder);
  }, [resultImagesOrder]);

  useEffect(() => {
    if (!resultOrder) return;
    getSizesByProduct(resultOrder?.detail[0]?.id);
    setProductSelected(() => resultOrder?.detail[0].id);
  }, [resultOrder]);

  return (
    <div className={styles.confirmedOrderAdminPage}>
      {errorOrder && <NotFoundPage />}
      {!errorOrder && loadingOrder && <LoadingView />}
      {!errorOrder && !loadingOrder && resultOrder && (
        <div className={styles.formContainer}>
          {!resultOrder?.detail && (
            <h3 className={styles.sectionTitle}>No hay productos</h3>
          )}
          {resultOrder?.detail?.length > 0 && (
            <h3 className={styles.sectionTitle}>Productos </h3>
          )}
          <div className={styles.selectedProductsGrid}>
            {resultOrder?.detail?.map((product) => (
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
            ))}
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
              {/* Poner un href que navege a product selected */}
              <a href={`/producto/${productSelected}`}>
                Ver detalles del producto
              </a>
            </div>
          </div>
          <div className={styles.sizes}>
            <h3 className={styles.sectionTitle}>Tallas</h3>
            <Table
              header={['Talla', 'Cantidad', 'Precio']}
              loading={loadingSizes}
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
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Descripción del pedido</h3>
            <TextArea
              name="description"
              title="Descripción"
              className={styles.detailsTextArea}
              value={resultOrder.description}
              error={errors.description}
              onFocus={clearError}
              onChange={() => {}}
              readOnly
            />
            {resultOrder?.media && (
            <div className={styles.imagesContainer}>
              <h3 className={styles.sectionTitle}>Imágenes del pedido</h3>
              <ImageViewer
                images={resultOrder?.media?.map((image) => ({
                  id: image.id,
                  uri: image.uri,
                }))}
              />
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfirmedOrderAdminPage;
