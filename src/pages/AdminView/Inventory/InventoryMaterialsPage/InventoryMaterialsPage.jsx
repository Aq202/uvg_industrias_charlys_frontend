/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import UpdateIcon from '@mui/icons-material/Update';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import useCount from '../../../../hooks/useCount';
import SearchInput from '../../../../components/SearchInput/SearchInput';
import InputSelect from '../../../../components/InputSelect/InputSelect';
import styles from './InventoryMaterialsPage.module.css';
import useToken from '../../../../hooks/useToken';
import Button from '../../../../components/Button/Button';
import usePopUp from '../../../../hooks/usePopUp';
import InventoryDetails from '../../../../components/InventoryDetails/InventoryDetails';
import PopUp from '../../../../components/PopUp/PopUp';
import SuccessNotificationPopUp from '../../../../components/SuccessNotificationPopUp/SuccessNotificationPopUp';
import NewMaterialFormPopUp from '../../../../components/NewMaterialFormPopUp/NewMaterialFormPopUp';
import Table from '../../../../components/Table/Table';
import TableRow from '../../../../components/TableRow/TableRow';

function InventoryMaterialsPage() {
  const {
    callFetch, result, loading,
  } = useFetch();
  const {
    callFetch: callFetch2, result: result2, loading: loading2,
  } = useFetch();

  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isMaterialFormOpen, openMaterialForm, closeMaterialForm] = usePopUp();

  const { count, next } = useCount(0);
  const token = useToken();
  const [type, setType] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [idToUpdate, setIdToUpdate] = useState(null);

  useEffect(() => {
    callFetch({ uri: `${serverHost}/inventory/material`, headers: { authorization: token } });
  }, [count]);

  useEffect(() => {
    callFetch2({ uri: `${serverHost}/inventory/materialType`, headers: { authorization: token } });
  }, [count]);

  const searchMaterial = (search) => {
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
  return (
    <div className={styles.inventory}>
      <div className={`${styles.store}`}>
        <h2>Inventario en bodega</h2>
        <Button text="Nuevo" name="create-item-button" type="button" green onClick={openMaterialForm} />
      </div>
      <div className={`${styles.info}`}>
        <div className={`${styles.head}`}>
          <div className={`${styles.option}`}>
            <InputSelect
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
            <SearchInput handleSearch={searchMaterial} />
          </div>
        </div>
        <Table
          header={['ID', 'Nombre', 'Tipo', 'Cantidad', 'Acción']}
          breakPoint="600px"
          maxCellWidth="140px"
          showCheckbox={false}
          className={styles.table}
          loading={loading}
        >
          {result?.map(
            (val) => (type === '' || val.materialType === type) && (
            <TableRow key={val.id} onClick={() => setSelectedItemId(val.id)}>
              <td>{val.id}</td>
              <td>{val.materialName}</td>
              <td>{val.materialType}</td>
              <td>{val.quantity}</td>
              <td>
                <div className={`${styles.icons}`}>
                  <button type="button" className={styles.iconButton} onClick={(e) => handleUpdateClick(e, val.id)}>
                    <UpdateIcon />
                  </button>
                </div>
              </td>
            </TableRow>
            ),
          )}
        </Table>

      </div>
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
        successCallback={next}
        next
      />

      <SuccessNotificationPopUp
        close={closeSuccess}
        isOpen={isSuccessOpen}
        text="El artículo se ha actualizado correctamente."
      />
    </div>
  );
}

export default InventoryMaterialsPage;
