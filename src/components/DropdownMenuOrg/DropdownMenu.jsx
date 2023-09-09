import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import useToken from '@hooks//useToken';
import SubLoadingView from '@components/SubLoadingView/SubLoadingView';
import styles from './DropdownMenu.module.css';

function DropdownMenu({ onSelect, id }) {
  const {
    callFetch, result, error, loading,
  } = useFetch();

  const token = useToken();
  const [selectedValue, setSelectedValue] = useState(id);

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
    setSelectedValue(id);
    onSelect(id);
  }, [id]);

  const handleSelectChange = (event) => {
    const newId = event.target.value;
    setSelectedValue(newId);
    onSelect(newId);
  };

  return (
    <div className={`${styles.dropdownContainer}`}>
      {loading && <SubLoadingView />}
      {error && 'Ocurrió un error.'}
      {result && (
        <select
          className={`${styles.menu}`}
          name="orgMenu"
          id="organitations"
          onChange={handleSelectChange}
          defaultValue={selectedValue || 'seleccionar'}
        >
          <option className={`${styles.option}`} value="seleccionar" disabled>
            Seleccionar
          </option>
          {result.result && result.result.map((org) => (
            <option key={org.id} className={`${styles.option}`} value={`${org.id}`}>
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
  onSelect: PropTypes.func.isRequired,
  id: PropTypes.string,
};

DropdownMenu.defaultProps = {
  id: '',
};
