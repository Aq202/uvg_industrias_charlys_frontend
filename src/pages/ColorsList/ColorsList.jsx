/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { serverHost } from '@/config';
import Button from '../../components/Button/Button';
import styles from './ColorsList.module.css';
import SearchInput from '../../components/SearchInput/SearchInput';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import InputSelect from '../../components/InputSelect/InputSelect';
import LoadingView from '../../components/LoadingView/LoadingView';
import garbage from '../../assets/garbage.svg';

function ColorsList() {
  const {
    callFetch: getColors,
    result: resultColors,
    loading: loadingColors,
    error: errorColors,
  } = useFetch();

  const {
    callFetch: getOrganizations,
    result: resultOrganizations,
    error: errorOrganizations,
    loading: loadingOrganizations,
  } = useFetch();

  const token = useToken();
  const [orgId, setOrgId] = useState(null);

  const organizations = () => {
    getOrganizations({
      uri: `${serverHost}/organization/`,
      headers: { authorization: token },
    });
  };

  const colors = () => {
    getColors({
      uri: `${serverHost}/color/organization/${orgId}`,
      headers: { authorization: token },
    });
  };

  const searchColors = (search) => {
    getColors({
      uri: `${serverHost}/color/organization/${orgId}?search=${search}`,
      method: 'GET',
      headers: { authorization: token },
    });
  };

  useEffect(() => {
    organizations();
    setOrgId(resultOrganizations?.result[0]?.id);
  }, []);

  useEffect(() => {
    colors();
  }, [orgId]);

  return (
    <div>
      {(loadingOrganizations || loadingColors) && <LoadingView />}
      <div className={styles.colorsList}>
        <div className={styles.title}>
          <h2>Colores</h2>
          <Button text="Nuevo" green name="new" />
        </div>
        <div className={styles.content}>
          <div className={styles.filters}>
            <InputSelect
              value={orgId}
              name="organization"
              options={
                resultOrganizations?.result?.map((org) => ({ value: org.id, title: org.name }))
            }
              onChange={(e) => setOrgId(e.target.value)}
            />
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
                    setSizeToDelete(size.size);
                    openDeleteSize();
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorsList;
