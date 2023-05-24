/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Searcher from '@components/Searcher/Searcher';
import { serverHost } from '@/config';
import NavBar from '@components/NavBar/NavBar';
import useFetch from '@hooks/useFetch';
import InputSelect from '../../../components/InputSelect/InputSelect';
import styles from './Inventory.module.css';
import MaterialInventory from './MaterialInventory';
import FabricInventory from './FabricInventory';
import useToken from '../../../hooks/useToken';
import Spinner from '../../../components/Spinner/Spinner';
import InputText from '../../../components/InputText/InputText';
import Button from '../../../components/Button/Button';

function Inventory() {
  const {
    callFetch, result, error, loading,
  } = useFetch();
  const {
    callFetch: callFetch3, result: result3, error: error3, loading: loading3,
  } = useFetch();

  const token = useToken();
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');
  useEffect(() => {
    callFetch({ uri: `${serverHost}/generalInfo/material`, headers: { authorization: token } });
    callFetch3({ uri: `${serverHost}/generalInfo/fabric`, headers: { authorization: token } });
  }, []);

  const searchMaterial = () => {
    if (type === 'Material') { callFetch({ uri: `${serverHost}/generalInfo/material/?search=&#39;${search}&#39;`, headers: { authorization: token } }); }
    if (type === 'Fabrica') { callFetch({ uri: `${serverHost}/generalInfo/fabrica/?search=&#39;${search}&#39;`, headers: { authorization: token } }); }
  };
  return (
    <div className={`${styles.inventory}`}>
      <NavBar />
      <div className={`${styles.select}`}>
        <InputSelect
          title="Tipo"
          value={type}
          onChange={(e) => setType(e.target.value)}
          name="sizeProduct"
          options={[{ value: 'Material', title: 'Material' }, { value: 'Fabrica', title: 'Fabrica' }]}
          placeholder="Selecciona un tipo"
        />
      </div>
      <div className={`${styles.searcher}`}>
        <InputText
          onChange={(e) => setSearch(e.target.value)}
          title="Buscar"
          name="search"
          value={search}
        />
        <Button text="Buscar" onClick={searchMaterial} type="primary" />
      </div>
      {error && 'Ocurrio un error'}
      {loading && <Spinner />}
      {result?.length > 0 && type === 'Material' && (
      <div className={`${styles.info}`}>
        <div className={`${styles.header}`}>
          <span>ID</span>
          <span>Descripcion</span>
          <span>Cantidad</span>
        </div>
        <div>
          {result.map((val) => (
            <MaterialInventory id={val.id} desc={val.description} amount={val.quantity} />
          ))}
        </div>
      </div>
      )}

      {error3 && 'Ocurrio un error'}
      {loading3 && <Spinner />}
      {result3?.length > 0 && type === 'Fabrica' && (
        <div className={`${styles.info}`}>
          <div className={`${styles.header}`}>
            <span>ID</span>
            <span>Nombre</span>
            <span>Color</span>
            <span>Cantidad</span>
          </div>
          <div className={`${styles.fabrics}`}>
            {result3.map((val) => (
              <FabricInventory
                id={val.id}
                name={val.fabric}
                color={val.color}
                amount={val.quantity}
              />
            ))}

          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
