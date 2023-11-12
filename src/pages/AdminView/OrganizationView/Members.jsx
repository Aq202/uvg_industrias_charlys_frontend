import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import useCount from '../../../hooks/useCount';
import useToken from '../../../hooks/useToken';
import Button from '../../../components/Button/Button';
import Table from '../../../components/Table/Table';
import TableRow from '../../../components/TableRow/TableRow';
import NewMemberFormPopUp from '../../../components/NewMemberFormPopUp/NewMemberFormPopUp';
import DeleteMemberPopUp from '../../../components/DeleteMemberPopUp/DeleteMemberPopUp';
import usePopUp from '../../../hooks/usePopUp';
import styles from './Members.module.css';
import SearchInput from '../../../components/SearchInput/SearchInput';
import consts from '../../../helpers/consts';

function Members({ orgId, orgName }) {
  const {
    callFetch, result, loading,
  } = useFetch();

  const { count, next } = useCount(0);
  const token = useToken();
  const [idToDelete, setIdToDelete] = useState(null);
  const [isDeleteMemberOpen, openDeleteMember, closeDeleteMember] = usePopUp();
  const [isMemberFormOpen, openMemberForm, closeMemberForm] = usePopUp();
  const [query, setQuery] = useState(null);
  const [currPage, setCurrPage] = useState(0);

  const handleSearch = (val) => {
    if (val?.trim().length > 0) setQuery(val);
    else setQuery(null);
  };

  useEffect(() => {
    let uri = `${serverHost}/organization/clients/${orgId}`;

    if (query) {
      const params = new URLSearchParams({ search: query });
      uri += `?${params.toString()}`;
    }

    const page = new URLSearchParams({ page: currPage });
    uri += `?${page.toString()}`;

    callFetch({ uri, headers: { authorization: token } });
  }, [count, query, currPage]);

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setIdToDelete(id);
    openDeleteMember();
  };

  const handlePageChange = (e, page) => {
    e.preventDefault();
    setCurrPage(page - 1);
  };

  return (
    <div className={styles.members}>
      <div className={styles.header}>
        <h2>
          Miembros de la organización
        </h2>
        <Button text="Nuevo" onClick={openMemberForm} />
      </div>
      <div className={styles.membersList}>
        <div className={styles.searchContainer}>
          <SearchInput handleSearch={handleSearch} />
        </div>
        <div className={styles.content}>
          <Table
            header={['ID', 'Nombre', 'Email', 'Acción']}
            breakPoint="280px"
            maxCellWidth="140px"
            showCheckbox={false}
            className={styles.table}
            loading={loading}
          >
            {
              result?.result.map((val) => (
                <TableRow key={val.id}>
                  <td>{val.id}</td>
                  <td>
                    {`${val.name} ${val.lastname}`}
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
        </div>
        {!loading && result && (
          <Pagination
            count={Math.floor(result.count / consts.pageLength) + 1}
            className={styles.pagination}
            onChange={handlePageChange}
            page={currPage + 1}
          />
        )}
      </div>
      <NewMemberFormPopUp
        close={closeMemberForm}
        isOpen={isMemberFormOpen}
        id={orgId}
        successCallback={next}
        next
      />
      <DeleteMemberPopUp
        close={closeDeleteMember}
        isOpen={isDeleteMemberOpen}
        id={idToDelete}
        orgName={orgName}
        name={result?.result.find((member) => member.id === idToDelete)?.name}
        successCallback={next}
      />
    </div>
  );
}

Members.propTypes = {
  orgId: PropTypes.string.isRequired,
  orgName: PropTypes.string.isRequired,
};

export default Members;
