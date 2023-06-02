/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { serverHost } from '@/config';
import NavBar from '@components/NavBar/NavBar';
import useFetch from '@hooks/useFetch';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import InputSelect from '../../../components/InputSelect/InputSelect';
import styles from './Inventory.module.css';
import useToken from '../../../hooks/useToken';
import Spinner from '../../../components/Spinner/Spinner';
import InputText from '../../../components/InputText/InputText';
import Button from '../../../components/Button/Button';
import usePopUp from '../../../hooks/usePopUp';
import InventoryDetails from '../../../components/InventoryDetails/InventoryDetails';
import PopUp from '../../../components/PopUp/PopUp';
import SuccessNotificationPopUp from '../../../components/SuccessNotificationPopUp/SuccessNotificationPopUp';

function Inventory() {
  const {
    callFetch, result, error, loading,
  } = useFetch();
  const {
    callFetch: callFetch3, result: result3, error: error3, loading: loading3,
  } = useFetch();
  const {
    callFetch: callFetch2, result: result2, error: error2, loading: loading2,
  } = useFetch();

  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();

  const token = useToken();
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    callFetch2({ uri: `${serverHost}/inventory`, headers: { authorization: token } });
  }, []);

  useEffect(() => {
    callFetch({ uri: `${serverHost}/generalInfo/material`, headers: { authorization: token } });
    callFetch3({ uri: `${serverHost}/generalInfo/fabric`, headers: { authorization: token } });
    callFetch2({ uri: `${serverHost}/inventory`, headers: { authorization: token } });
  }, [type]);

  const searchMaterial = () => {
    if (type === 'Material') {
      callFetch({
        uri: `${serverHost}/generalInfo/material?search=${search}`,
        headers: { authorization: token },
      });
    }
    if (type === 'Fabrica') {
      callFetch3({
        uri: `${serverHost}/generalInfo/fabric?search=${search}`,
        headers: { authorization: token },
      });
    }
    if (type === '') {
      callFetch2({
        uri: `${serverHost}/inventory?search=${search}`,
        headers: { authorization: token },
      });
    }
  };

  const renderMaterialInventory = () => (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Descripcion</th>
          <th>Cantidad</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {result.map((val) => (
          <tr onClick={() => setSelectedItemId(val.id)}>
            <td>{val.id}</td>
            <td>{val.description}</td>
            <td>{val.quantity}</td>
            <td>
              <div>
                <UpdateIcon />
                <DeleteIcon />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const handleOnUpdateSuccess = () => openSuccess();

  const renderFabricInventory = () => (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Color</th>
          <th>Cantidad</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {result3.map((val) => (
          <tr onClick={() => setSelectedItemId(val.id)}>
            <td>{val.id}</td>
            <td>{val.fabric}</td>
            <td>{val.color}</td>
            <td>{val.quantity}</td>
            <td>
              <div>
                <UpdateIcon />
                <DeleteIcon />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderInventory = () => (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Característica</th>
          <th>Color</th>
          <th>Cantidad</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {result2.map((val) => (
          <tr onClick={() => setSelectedItemId(val.id)}>
            <td>{val.type}</td>
            <td>{val.materialType}</td>
            <td>{val.color}</td>
            <td>{val.quantity}</td>
            <td>
              <div className={`${styles.icons}`}>
                <UpdateIcon />
                <DeleteIcon />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className={styles.inventory}>
      <NavBar loggedIn />
      <h1>Inventario</h1>
      <div className={`${styles.store}`}>
        <h2>Inventario en bodega</h2>
        <div className={`${styles.buttons}`}>
          <Button text="Nuevo" onClick={searchMaterial} type="secondary" />
          <Button text="Actualizar" onClick={searchMaterial} type="secondary" />
        </div>
      </div>
      <div className={`${styles.top}`}>
        <div className={styles.select}>
          <InputSelect
            title="Tipo"
            value={type}
            onChange={(e) => setType(e.target.value)}
            name="sizeProduct"
            options={[
              { value: 'Material', title: 'Material' },
              { value: 'Fabrica', title: 'Fabrica' },
            ]}
          />
        </div>
        <div className={styles.searchContainer}>
          <InputText
            onChange={(e) => setSearch(e.target.value)}
            title="Buscar"
            name="search"
            value={search}
          />
          <Button text="Buscar" onClick={searchMaterial} type="primary" />
        </div>
      </div>
      <div className={`${styles.load}`}>
        {type === 'Material' && error && 'Ocurrio un error'}
        {type === 'Fabrica' && error3 && 'Ocurrio un error'}
        {type === '' && error2 && 'Ocurrio un error'}
        {type === 'Material' && loading && <Spinner />}
        {type === 'Fabrica' && loading3 && <Spinner />}
        {type === '' && loading2 && <Spinner />}
      </div>
      {type === 'Material' && result?.length > 0 && renderMaterialInventory()}
      {type === 'Fabrica' && result3?.length > 0 && renderFabricInventory()}
      {type === '' && result2?.length > 0 && renderInventory()}

      {selectedItemId !== null && (
        <PopUp close={() => setSelectedItemId(null)} closeWithBackground={false}>
          <InventoryDetails itemId={selectedItemId} onSuccess={handleOnUpdateSuccess} />
        </PopUp>
      )}

      <SuccessNotificationPopUp
        close={closeSuccess}
        isOpen={isSuccessOpen}
        text="El artículo se ha actualizado correctamente."
      />
    </div>
  );
}

export default Inventory;
