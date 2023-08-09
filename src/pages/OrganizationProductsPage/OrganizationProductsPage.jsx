import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { NavLink, useParams } from 'react-router-dom';
import styles from './OrganizationProductsPage.module.css';
import ProductFilter from '../../components/ProductFilter/ProductFilter';
import ProductModel from '../../components/ProductModel/ProductModel';
import Button from '../../components/Button/Button';
import { serverHost } from '../../config';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import useApiMultipleImages from '../../hooks/useApiMultipleImages';

function OrganizationProductsPage() {
  const { orgId } = useParams();
  const [filters, setFilters] = useState(null);
  const { callFetch: getProductsFetch, result: products } = useFetch();
  const token = useToken();
  const {
    getMultipleApiImages, result: productImages,
  } = useApiMultipleImages();

  useEffect(() => {
    if (!orgId || !token) return;
    const uri = `${serverHost}/product/model/by-organization/${orgId}`;

    getProductsFetch({
      uri,
      method: 'POST',
      headers: { authorization: token },
    });
  }, [orgId, token]);

  useEffect(() => {
    if (!filters) return;
    const { types, colors, query } = filters;

    let searchParams = null;

    if (query?.length > 0) {
      searchParams = new URLSearchParams({ search: query });
    }

    const uri = `${serverHost}/product/model/by-organization/${orgId}${
      searchParams ? `?${searchParams.toString()}` : ''
    }`;

    const body = {};
    if (types?.length > 0) body.types = types;
    if (colors?.length > 0) body.colors = colors;

    getProductsFetch({
      uri,
      method: 'POST',
      headers: { authorization: token },
      body: JSON.stringify(body),
    });
  }, [filters]);

  useEffect(() => {
    if (!products) return;

    // obtener imagenes protegidas
    const images = products
      .filter((data) => data?.media?.length > 0)
      .map((data) => ({ id: data.id, uri: data.media[0] }));
    getMultipleApiImages(images);
  }, [products]);

  return (
    <div className={styles.organizationProductsPage}>
      <header className={styles.pageHeader}>
        <h1>Productos</h1>
        <NavLink to="/hey">
          <Button text="Nuevo producto" name="new-product" />
        </NavLink>
      </header>
      <ProductFilter
        className={styles.productFilter}
        idOrganization="ORG000000000003"
        onChange={(val) => setFilters(val)}
      />
      <div className={styles.productsContainer}>
        {products?.map((data) => (
          <ProductModel
            url="/hey"
            name={data.description}
            imageUrl={productImages?.[data.id]}
            type={data.type}
            organization="Colegio Don Bosco"
            colors={data?.colors?.map((color) => ({
              name: color.color,
              r: color.red,
              b: color.blue,
              g: color.green,
            }))}
            key={data.id}
          />
        ))}
      </div>
    </div>
  );
}

export default OrganizationProductsPage;

OrganizationProductsPage.propTypes = {};

OrganizationProductsPage.defaultProps = {};
