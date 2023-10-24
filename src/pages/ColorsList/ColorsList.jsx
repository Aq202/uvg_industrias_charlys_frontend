/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import { serverHost } from '@/config';
import Button from '../../components/Button/Button';
import styles from './ColorsList.module.css';
import SearchInput from '../../components/SearchInput/SearchInput';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import LoadingView from '../../components/LoadingView/LoadingView';
import garbage from '../../assets/garbage.svg';
import DeleteColorPopUp from '../../components/DeleteColorPopUp/DeleteColorPopUp';
import usePopUp from '../../hooks/usePopUp';
import NewColorFormPopUp from '../../components/NewColorFormPopUp/NewColorFormPopUp';

function ColorsList() {
  const {
    callFetch: getColors,
    result: resultColors,
    loading: loadingColors,
    error: errorColors,
  } = useFetch();

  const token = useToken();
  const [colorToDelete, setColorToDelete] = useState(null);

  const [isColorFormOpen, openColorForm, closeColorForm] = usePopUp();
  const [isDeleteColorOpen, openDeleteColor, closeDeleteColor] = usePopUp();

  const colors = () => {
    getColors({
      uri: `${serverHost}/color/`,
      headers: { authorization: token },
    });
  };

  const searchColors = (search) => {
    getColors({
      uri: `${serverHost}/color/?search=${search}`,
      headers: { authorization: token },
    });
  };

  useEffect(() => {
    colors();
  }, []);

  useEffect(() => {
  }, [colorToDelete]);

  return (
    <div>
      {errorColors && <p>Hubo un error al cargar los colores</p>}
      {!errorColors && loadingColors && <LoadingView />}
      <div className={styles.colorsList}>
        <div className={styles.title}>
          <h2>Colores</h2>
          <Button text="Nuevo" green name="new" onClick={openColorForm} />
        </div>
        <div className={styles.content}>
          <div className={styles.filters}>
            <SearchInput handleSearch={searchColors} />
          </div>
          <div className={styles.colors}>
            {errorColors && <p>No hay resultados</p>}
            {resultColors?.map((color) => (
              <div className={styles.colorsContainer}>
                <div className={styles.info}>
                  <span
                    className={styles.color}
                    style={{ backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})` }}
                    title={color.name}
                  />
                  <p>{color.name}</p>
                </div>
                <img
                  src={garbage}
                  alt="Delete"
                  className={styles.garbageIcon}
                  onClick={() => {
                    setColorToDelete(color.id);
                    openDeleteColor();
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <NewColorFormPopUp
        close={closeColorForm}
        isOpen={isColorFormOpen}
        closeCallback={colors}
        successCallback={colors}
      />
      <DeleteColorPopUp
        color={colorToDelete}
        close={closeDeleteColor}
        isOpen={isDeleteColorOpen}
        successCallback={colors}
        id={colorToDelete}
      />
    </div>
  );
}

export default ColorsList;
