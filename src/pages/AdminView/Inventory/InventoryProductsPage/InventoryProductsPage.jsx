import React, { useState, useEffect } from 'react';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import { Link } from 'react-router-dom';
import { MdEdit as UpdateIcon } from 'react-icons/md';
import SearchInput from '../../../../components/SearchInput/SearchInput';
import InputSelect from '../../../../components/InputSelect/InputSelect';
import styles from './InventoryProductsPage.module.css';
import useToken from '../../../../hooks/useToken';
import Button from '../../../../components/Button/Button';
import Table from '../../../../components/Table/Table';
import TableRow from '../../../../components/TableRow/TableRow';
import ProductModel from '../../../../components/ProductModel/ProductModel';
import usePopUp from '../../../../hooks/usePopUp';
import NewProductFormPopUp from '../../../../components/NewProductPopUp/NewProductPopUp';
import UpdateInventoryProductPopUp from '../../../../components/UpdateInventoryProductPopUp/UpdateInventoryProductPopUp';
import useCount from '../../../../hooks/useCount';

function InventoryProductsPage() {
  const [filter, setFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [productToEdit, setProductToEdit] = useState(null);

  const { count: updateTableTrigger, next: activateTrigger } = useCount(0);

  const token = useToken();

  const {
    callFetch: fetchOrganizations,
    result: organizationsResult,
    loading: loadingOrganizations,
  } = useFetch();

  const {
    callFetch: fetchProducts,
    result: productsResult,
    loading: loadingProducts,
  } = useFetch();

  const [isNewProductoOpen, openNewProduct, closeNewProduct] = usePopUp();

  const handleFilterChange = (id, value) => {
    setFilter((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    fetchOrganizations({ uri: `${serverHost}/organization`, headers: { authorizations: token } });
  }, []);

  useEffect(() => {
    const filterCpy = filter;

    if (filter.organization?.trim()?.length === 0) delete filterCpy.organization;
    if (filter.search?.trim()?.length === 0) delete filterCpy.search;
    filterCpy.page = currentPage;

    const searchParams = new URLSearchParams(filter);
    const uri = `${serverHost}/inventory/product?${searchParams.toString()}`;

    fetchProducts({ uri, headers: { authorization: token } });
  }, [filter, currentPage, updateTableTrigger]);

  useEffect(() => {
    setCurrentPage(0);
  }, [filter]);

  return (
    <div className={styles.inventory}>
      <div className={`${styles.store}`}>
        <h2>Productos en inventario</h2>
        <Button text="Nuevo" name="create-inv-product-button" type="button" green onClick={openNewProduct} />
      </div>
      <div className={`${styles.info}`}>
        <div className={`${styles.head}`}>
          <div className={`${styles.option}`}>
            <InputSelect
              value={filter?.organization}
              onChange={(e) => handleFilterChange('organization', e.target.value)}
              name="type"
              disabled={loadingOrganizations}
              options={organizationsResult?.result.map((org) => ({
                value: org.id,
                title: org.name,
              }))}
            />
          </div>
          <div className={styles.searchContainer}>
            <SearchInput handleSearch={(search) => handleFilterChange('search', search)} />
          </div>
        </div>
        <Table
          header={['Productos en inventario']}
          breakPoint="1px"
          showCheckbox={false}
          className={styles.table}
          loading={loadingProducts}
          numOfPages={productsResult?.pages}
          currentPage={currentPage}
          handlePageChange={setCurrentPage}
        >
          {productsResult?.result?.map((product) => (
            <TableRow>
              <div className={styles.rowContainer}>
                <ProductModel
                  url={`/producto/${product.idProduct}`}
                  name={product.productName}
                  imageUrl={product.media?.[0] ? `${serverHost}/image/product/${product.media?.[0]}` : null}
                  type={product.type}
                  organization={product.client}
                  colors={product.colors}
                  className={styles.productModel}
                />

                <div className={styles.productData}>
                  <p className={styles.dataRow}>
                    <span>Cliente: </span>
                    {product.client}
                  </p>
                  <p className={styles.dataRow}>
                    <span>No. pedido: </span>
                    <Link to={`/ordenConfirmada/${product.idOrder}`}>{product.idOrder}</Link>
                  </p>

                  <table className={styles.sizesTable}>
                    <thead>
                      <tr>
                        <th>Talla</th>
                        <th>Cantidad</th>
                        <th>&nbsp;</th>
                      </tr>
                    </thead>
                    {product.sizes.map(({ size, quantity }) => (
                      <tr>
                        <td>{size}</td>
                        <td>{quantity}</td>
                        <td>
                          <button
                            type="button"
                            className={styles.iconButton}
                            onClick={() => setProductToEdit({
                              product: {
                                id: product.idProduct,
                                name: product.productName,
                                imageUrl: product.media?.[0] ? `${serverHost}/image/product/${product.media?.[0]}` : null,
                                type: product.type,
                                organization: product.client,
                                colors: product.colors,

                              },
                              size,
                              quantity,
                            })}
                          >
                            <UpdateIcon className={styles.updateIcon} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tfoot>
                      <tr>
                        <td>Total</td>
                        <td>{`${product.sizes?.reduce((ac, prod) => ac + (prod?.quantity || 0), 0)}`}</td>
                      </tr>
                    </tfoot>
                  </table>

                </div>
              </div>
            </TableRow>
          ))}
        </Table>

      </div>

      <NewProductFormPopUp close={closeNewProduct} isOpen={isNewProductoOpen} />
      <UpdateInventoryProductPopUp
        close={() => setProductToEdit(null)}
        isOpen={productToEdit !== null}
        product={productToEdit?.product}
        size={productToEdit?.size}
        defaultQuantity={productToEdit?.quantity}
        onSuccess={activateTrigger}
      />

    </div>
  );
}

export default InventoryProductsPage;
