/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import { serverHost } from '@/config';
import Button from '../../components/Button/Button';
import styles from './ProductTypesList.module.css';
import SearchInput from '../../components/SearchInput/SearchInput';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import LoadingView from '../../components/LoadingView/LoadingView';
import garbage from '../../assets/garbage.svg';
import useCount from '../../hooks/useCount';
import usePopUp from '../../hooks/usePopUp';
import NewProductTypePopUp from '../../components/NewProductTypePopUp/NewProductTypePopUp';
import DeleteProductTypePopUp from '../../components/DeleteProductTypePopUp/DeleteProductTypePopUp';

function ProductTypesList() {
  const {
    callFetch: fetchTypes,
    result: resultTypes,
    loading: loadingTypes,
    error: errorTypes,
  } = useFetch();

  const token = useToken();

  const { count, next } = useCount(0);

  const [typeToDelete, setTypeToDelete] = useState(null);
  const [query, setQuery] = useState(null);

  const [isNewTypeFormOpen, openNewTypesForm, closeNewTypeForm] = usePopUp();
  const [isDeleteTypeOpen, openDeleteType, closeDeleteType] = usePopUp();

  useEffect(() => {
    const params = new URLSearchParams();

    if (query) {
      params.set('search', query);
    }

    fetchTypes({
      uri: `${serverHost}/product/type?${params.toString()}`,
      headers: { authorization: token },
    });
  }, [count, query]);

  return (
    <div className={styles.page}>
      {loadingTypes && <LoadingView />}
      <div className={styles.sizesList}>
        <div className={styles.title}>
          <h2>Tipos de producto</h2>
          <Button
            text="Nuevo"
            green
            name="new"
            onClick={openNewTypesForm}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.filters}>
            <SearchInput handleSearch={setQuery} />
          </div>
          {errorTypes && <p className={styles.noResult}>No se encontraron resultados.</p>}

          <div className={styles.sizes}>
            {resultTypes?.result?.map(({ id, name }) => (
              <div className={styles.size}>
                <p>{name}</p>
                <img
                  src={garbage}
                  alt="Delete"
                  className={styles.garbageIcon}
                  onClick={() => {
                    setTypeToDelete({ id, name });
                    openDeleteType();
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <NewProductTypePopUp
        close={closeNewTypeForm}
        isOpen={isNewTypeFormOpen}
        successCallback={next}
      />
      <DeleteProductTypePopUp
        close={closeDeleteType}
        isOpen={isDeleteTypeOpen}
        id={typeToDelete?.id}
        name={typeToDelete?.name}
        successCallback={next}
      />
    </div>
  );
}

export default ProductTypesList;
