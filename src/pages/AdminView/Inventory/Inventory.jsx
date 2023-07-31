/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { serverHost } from '@/config';
import NavBar from '@components/NavBar/NavBar';
import useFetch from '@hooks/useFetch';
import UpdateIcon from '@mui/icons-material/Update';
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
import NewMaterialFormPopUp from '../../../components/NewMaterialFormPopUp/NewMaterialFormPopUp';

function Inventory() {
  const {
    callFetch, result, error, loading,
  } = useFetch();
  const {
    callFetch: callFetch2, result: result2, error: error2, loading: loading2,
  } = useFetch();

  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isMaterialFormOpen, openMaterialForm, closeMaterialForm] = usePopUp();

  const token = useToken();
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [idToUpdate, setIdToUpdate] = useState(null);

  useEffect(() => {
    callFetch({ uri: `${serverHost}/inventory`, headers: { authorization: token } });
  }, []);

  useEffect(() => {
    callFetch2({ uri: `${serverHost}/inventory/materialType`, headers: { authorization: token } });
  }, []);

  const searchMaterial = () => {
    callFetch({
      uri: `${serverHost}/inventory?search=${search}`,
      headers: { authorization: token },
    });
  };

  const handleUpdateClick = (e, id) => {
    e.stopPropagation();
    setIdToUpdate(id);
    openMaterialForm();
  };

  const handleOnUpdateSuccess = () => openSuccess();

  const renderTypeInventory = () => (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Color</th>
          <th>Cantidad</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {result.map(
          (val) => val.materialType === type && (
          <tr onClick={() => setSelectedItemId(val.id)}>
            <td>{val.id}</td>
            <td>{val.materialName}</td>
            <td>{val.quantity}</td>
            <td>
              <div className={`${styles.icons}`}>
                <button type="button" className={styles.iconButton} onClick={(e) => handleUpdateClick(e, val.id)}>
                  <UpdateIcon />
                </button>
                {/* <DeleteIcon /> */}
              </div>
            </td>
          </tr>
          ),
        )}
      </tbody>
    </table>
  );

  const renderInventory = () => (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Característica</th>
          <th>Nombre</th>
          <th>Cantidad</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {result.map((val) => (
          <tr onClick={() => setSelectedItemId(val.id)}>
            <td>{val.type}</td>
            <td>{val.materialType}</td>
            <td>{val.materialName}</td>
            <td>{val.quantity}</td>
            <td>
              <div className={`${styles.icons}`}>
                <button type="button" className={styles.iconButton} onClick={(e) => handleUpdateClick(e, val.id)}>
                  <UpdateIcon />
                </button>
                {/* <DeleteIcon /> */}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className={styles.inventory}>
      <h1>Inventario</h1>
      <div className={`${styles.store}`}>
        <h2>Inventario en bodega</h2>
        <div className={`${styles.buttons}`}>
          <Button text="Nuevo" type="button" green onClick={openMaterialForm} />
        </div>
      </div>
      <div className={`${styles.top}`}>
        <div className={styles.select}>
          <InputSelect
            title="Tipo"
            value={type}
            onChange={(e) => setType(e.target.value)}
            name="type"
            options={result2?.result.map((option) => ({
              value: option.name,
              title: option.name,
            }))}
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
        {(error || error2) && 'Ocurrio un error'}
        {(loading || loading2) && <Spinner />}
      </div>
      {type !== '' && result?.length > 0 && renderTypeInventory()}
      {type === '' && result?.length > 0 && renderInventory()}

      {selectedItemId !== null && (
        <PopUp close={() => setSelectedItemId(null)} closeWithBackground>
          <InventoryDetails itemId={selectedItemId} onSuccess={handleOnUpdateSuccess} />
        </PopUp>
      )}

      <NewMaterialFormPopUp
        close={closeMaterialForm}
        isOpen={isMaterialFormOpen}
        id={idToUpdate}
        closeCallback={() => setIdToUpdate(null)}
      />

      <SuccessNotificationPopUp
        close={closeSuccess}
        isOpen={isSuccessOpen}
        text="El artículo se ha actualizado correctamente."
      />
    </div>
  );
}

export default Inventory;
