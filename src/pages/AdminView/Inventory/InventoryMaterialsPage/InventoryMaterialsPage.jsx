/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { MdEdit as UpdateIcon } from 'react-icons/md';
import { Pagination } from '@mui/material';
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
    callFetch: fetchMaterials, result, loading,
  } = useFetch();
  const {
    callFetch: fetchMaterialTypes, result: materialsResult, loading: loading2,
  } = useFetch();

  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isMaterialFormOpen, openMaterialForm, closeMaterialForm] = usePopUp();

  const { count, next } = useCount(0);
  const token = useToken();
  const [type, setType] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [idToUpdate, setIdToUpdate] = useState(null);
  const [query, setQuery] = useState(null);
  const [currPage, setCurrPage] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams({ page: currPage });
    if (query) {
      params.set('search', query);
    }

    const uri = `${serverHost}/inventory/material?${params.toString()}`;

    fetchMaterials({ uri, headers: { authorization: token } });
  }, [count, query, currPage]);

  useEffect(() => {
    fetchMaterialTypes({ uri: `${serverHost}/inventory/materialType`, headers: { authorization: token } });
  }, [count]);

  const handleUpdateClick = (e, id) => {
    e.stopPropagation();
    setIdToUpdate(id);
    openMaterialForm();
  };

  const handlePageChange = (e, page) => {
    e.preventDefault();
    setCurrPage(page - 1);
  };

  const handleSearch = (val) => {
    if (val?.trim().length > 0) setQuery(val);
    else setQuery(null);
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
              options={materialsResult?.result?.map((option) => ({
                value: option.name,
                title: option.name,
              }))}
            />
          </div>
          <div className={styles.searchContainer}>
            <SearchInput handleSearch={handleSearch} />
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
          {result?.result?.map(
            (val) => (type === '' || val.materialType === type) && (
            <TableRow key={val.id} onClick={() => setSelectedItemId(val.id)}>
              <td>{val.id}</td>
              <td>{val.materialName}</td>
              <td>{val.materialType}</td>
              <td>{val.quantity}</td>
              <td>
                <div className={`${styles.icons}`}>
                  <button type="button" className={styles.iconButton} onClick={(e) => handleUpdateClick(e, val.id)}>
                    <UpdateIcon className={styles.updateIcon} />
                  </button>
                </div>
              </td>
            </TableRow>
            ),
          )}
        </Table>
        {!loading && result && (
          <Pagination
            count={+result.count}
            className={styles.pagination}
            onChange={handlePageChange}
            page={currPage + 1}
          />
        )}
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
