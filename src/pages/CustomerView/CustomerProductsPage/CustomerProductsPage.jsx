import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import searchBanner from '@assets/banner/search-banner.svg';
import ProductFilter from '@components/ProductFilter/ProductFilter';
import ProductModel from '@components/ProductModel/ProductModel';
import Button from '@components/Button/Button';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import useToken from '@hooks/useToken';
import useApiMultipleImages from '@hooks/useApiMultipleImages';
import Spinner from '@components/Spinner/Spinner';
import styles from './CustomerProductsPage.module.css';
import getTokenPayload from '../../../helpers/getTokenPayload';

function CustomerProductsPage() {
  const [filters, setFilters] = useState(null);
  const [organization, setOrganization] = useState();
  const {
    callFetch: getProductsFetch,
    result: products,
    loading: loadingProducts,
    error: errorProducts,
  } = useFetch();
  const token = useToken();
  const { getMultipleApiImages, result: productImages } = useApiMultipleImages();

  useEffect(() => {
    if (!token) return;
    const { clientOrganizationId: orgId } = getTokenPayload(token);
    setOrganization(orgId);
    const uri = `${serverHost}/product/model/by-organization/${orgId}`;

    getProductsFetch({
      uri,
      method: 'POST',
      headers: { authorization: token },
    });
  }, [token]);

  useEffect(() => {
    if (!filters) return;
    const { types, colors, query } = filters;

    let searchParams = null;

    if (query?.length > 0) {
      searchParams = new URLSearchParams({ search: query });
    }

    const uri = `${serverHost}/product/model/by-organization/${organization}${
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
        <h2>Productos</h2>
        <NavLink to="/producto/nuevo">
          <Button text="Nuevo producto" name="new-product" />
        </NavLink>
      </header>
      <ProductFilter
        className={styles.productFilter}
        idOrganization={organization}
        onChange={(val) => setFilters(val)}
      />
      <div className={styles.productsContainer}>
        {products?.map((data) => (
          <ProductModel
            url={`/producto/modelo/${data.id}`}
            name={data.description}
            imageUrl={productImages?.[data.id] ?? null}
            type={data.type}
            organization="Colegio Don Bosco"
            colors={data?.colors?.map((color) => ({
              name: color.color,
              r: color.red,
              b: color.blue,
              g: color.green,
            }))}
            key={data.id}
            loadingImage={!productImages?.[data.id] && data.media.length > 0}
          />
        ))}

        {loadingProducts && (
          <div className={styles.loadingContainer}>
            <Spinner />
          </div>
        )}

        { errorProducts && (
          <div className={styles.noResultContainer}>
            <img src={searchBanner} alt="Imágen de búsqueda" />
            <p>No se encontraron resultados</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerProductsPage;

CustomerProductsPage.propTypes = {};

CustomerProductsPage.defaultProps = {};
