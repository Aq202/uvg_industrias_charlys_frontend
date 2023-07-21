/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import useToken from '../../../hooks/useToken';
import Button from '../../../components/Button/Button';
import InputText from '../../../components/InputText/InputText';
import Spinner from '../../../components/Spinner/Spinner';
import Table from '../../../components/Table/Table';
import TableRow from '../../../components/TableRow/TableRow';
import NewMemberFormPopUp from '../../../components/NewMemberFormPopUp/NewMemberFormPopUp';
import DeleteMemberPopUp from '../../../components/DeleteMemberPopUp/DeleteMemberPopUp';
import usePopUp from '../../../hooks/usePopUp';
import styles from './Members.module.css';

function Members({ orgId, orgName }) {
  const {
    callFetch, result, error, loading,
  } = useFetch();

  const token = useToken();
  const [search, setSearch] = useState('');
  const [idToDelete, setIdToDelete] = useState(null);
  const [isDeleteMemberOpen, openDeleteMember, closeDeleteMember] = usePopUp();
  const [isMemberFormOpen, openMemberForm, closeMemberForm] = usePopUp();

  useEffect(() => {
    callFetch({ uri: `${serverHost}/organization/clients/${orgId}`, headers: { authorization: token } });
  }, []);

  const searchMember = () => {
    callFetch({
      uri: `${serverHost}/organization/clients/${orgId}?search=${search}`,
      headers: { authorization: token },
    });
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setIdToDelete(id);
    openDeleteMember();
  };

  const renderMembers = () => (
    <Table
      header={['ID', 'Nombre', 'Email', 'Acción']}
      breakPoint="280px"
      maxCellWidth="140px"
      showCheckbox={false}
      className={styles.table}
    >
      {
        result.map((val) => (
          <TableRow key={val.id}>
            <td>{val.id}</td>
            <td>
              {val.name }
              {val.lastname}
            </td>
            <td>{val.email}</td>
            <td>
              <div className={`${styles.icons}`}>
                <DeleteIcon onClick={(e) => handleDeleteClick(e, val.id)} />
              </div>
            </td>
          </TableRow>
        ))
      }
    </Table>
  );

  return (
    <div className={styles.members}>
      <div className={styles.header}>
        <h1>
          Miembros de la organización
        </h1>
        <Button text="Nuevo" onClick={openMemberForm} />
      </div>
      <div className={styles.membersList}>
        <div className={styles.searchContainer}>
          <InputText
            onChange={(e) => setSearch(e.target.value)}
            name="search"
            value={search}
          />
          <Button text="Buscar" onClick={searchMember} type="primary" />
        </div>
        <div className={styles.content}>
          <div className={`${styles.load}`}>
            {error && 'Ocurrió un error'}
            {loading && <Spinner />}
          </div>
          {result?.length > 0 ? renderMembers() : null}
        </div>
      </div>
      <NewMemberFormPopUp
        close={closeMemberForm}
        isOpen={isMemberFormOpen}
        id={orgId}
        closeCallback={() => {}}
      />
      <DeleteMemberPopUp
        close={closeDeleteMember}
        isOpen={isDeleteMemberOpen}
        id={idToDelete}
        orgName={orgName}
        closeCallback={() => {}}
      />
    </div>
  );
}

Members.propTypes = {
  orgId: PropTypes.string.isRequired,
  orgName: PropTypes.string.isRequired,
};

export default Members;
