/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { serverHost } from '@/config';
import Button from '../../components/Button/Button';
import styles from './SizesList.module.css';
import SearchInput from '../../components/SearchInput/SearchInput';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import LoadingView from '../../components/LoadingView/LoadingView';
import garbage from '../../assets/garbage.svg';

function SizesList() {
  const {
    callFetch: getSizes,
    result: resultSizes,
    loading: loadingSizes,
    error: errorSizes,
  } = useFetch();

  const token = useToken();

  const sizes = () => {
    getSizes({
      uri: `${serverHost}/generalInfo/size`,
      headers: { authorization: token },
    });
  };

  const searchSizes = (search) => {
    getSizes({
      uri: `${serverHost}/generalInfo/size?search=${search}`,
      headers: { authorization: token },
    });
  };

  useEffect(() => {
    sizes();
  }, []);

  return (
    <div>
      <div className={styles.sizesList}>
        <div className={styles.title}>
          <h2>Tallas</h2>
          <Button text="Nuevo" green name="new" />
        </div>
        <div className={styles.content}>
          <div className={styles.filters}>
            <SearchInput handleSearch={searchSizes} />
          </div>
          <div className={styles.sizes}>
            {resultSizes?.map((size) => (
              <div className={styles.size}>
                {size.size}
                <img
                  src={garbage}
                  alt="Delete"
                  className={styles.garbageIcon}
                />
              </div>

            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SizesList;
