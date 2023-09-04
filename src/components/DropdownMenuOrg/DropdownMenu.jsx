import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import useToken from '@hooks//useToken';
import SubLoadingView from '@components/SubLoadingView/SubLoadingView';
import styles from './DropdownMenu.module.css';

function DropdownMenu({ selected }) {
  const {
    callFetch, result, error, loading,
  } = useFetch();

  const token = useToken();
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!token) return;
    callFetch({
      uri: `${serverHost}/organization/`,
      headers: {
        authorization: token,
      },
    });
  }, [token]);

  useEffect(() => {
    const sortedList = result?.result;
    setList(sortedList);
  }, [result]);

  return (
    <div className={`${styles.dropdownContainer}`}>
      {loading && <SubLoadingView />}
      {error && 'Ocurrió un error.'}
      {list && (
        <select className={`${styles.menu}`} name="orgMenu" id="organitations">
          {selected && selected.substring(0, 2) === 'TC'
            && (
            <option className={`${styles.option}`} value="seleccionar" selected disabled>
              Seleccionar
            </option>
            )}
          {list && list.map((org) => (
            <option key={org.id} className={`${styles.option}`} value={`${org.id}`} selected={org.id === selected}>
              {org.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default DropdownMenu;

DropdownMenu.propTypes = {
  selected: PropTypes.string.isRequired,
};
