/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import { serverHost } from '@/config';
import Button from '../../components/Button/Button';
import styles from './SizesList.module.css';
import SearchInput from '../../components/SearchInput/SearchInput';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import LoadingView from '../../components/LoadingView/LoadingView';
import garbage from '../../assets/garbage.svg';
import useCount from '../../hooks/useCount';
import NewSizeFormPopUp from '../../components/NewSizeFormPopUp/NewSizeFormPopUp';
import usePopUp from '../../hooks/usePopUp';
import DeleteSizePopUp from '../../components/DeleteSizePopUp/DeleteSizePopUp';

function SizesList() {
  const {
    callFetch: getSizes,
    result: resultSizes,
    loading: loadingSizes,
    error: errorSizes,
  } = useFetch();

  const token = useToken();

  const { count, next } = useCount(0);

  const [sizeToDelete, setSizeToDelete] = useState(null);

  const [isSizeFormOpen, openSizeForm, closeSizeForm] = usePopUp();
  const [isDeleteSizeOpen, openDeleteSize, closeDeleteSize] = usePopUp();

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
  }, [count]);

  return (
    <div>
      {errorSizes && <p>Hubo un error al cargar las tallas</p>}
      {loadingSizes && <LoadingView />}
      <div className={styles.sizesList}>
        <div className={styles.title}>
          <h2>Tallas</h2>
          <Button
            text="Nuevo"
            green
            name="new"
            onClick={openSizeForm}
          />
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
                  onClick={() => {
                    setSizeToDelete(size.size);
                    openDeleteSize();
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <NewSizeFormPopUp
        close={closeSizeForm}
        isOpen={isSizeFormOpen}
        successCallback={next}
      />
      <DeleteSizePopUp
        close={closeDeleteSize}
        isOpen={isDeleteSizeOpen}
        size={sizeToDelete}
        onSuccess={next}
        onCancel={closeDeleteSize}
      />
    </div>
  );
}

export default SizesList;
