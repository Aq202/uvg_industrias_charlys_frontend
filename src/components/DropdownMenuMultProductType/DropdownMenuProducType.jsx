import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import useToken from '@hooks/useToken';
import useToogle from '@hooks/useToogle';
import SubLoadingView from '@components/SubLoadingView/SubLoadingView';
import styles from './DropdownMenuProductType.module.css';

function DropdownMenuProductType({ orgId, onChange }) {
  const {
    callFetch, result, error, loading,
  } = useFetch();

  const token = useToken();
  const [selectedValues, setSelectedValues] = useState([]);
  const [showList, toggleShowList] = useToogle(false);

  useEffect(() => {
    if (!token) return;
    callFetch({
      uri: `${serverHost}/product/type/by-organization/${orgId}`,
      headers: {
        authorization: token,
      },
    });
  }, [token]);

  const handleSelectChange = (event, selectedId, selectedName) => {
    event.stopPropagation();

    // Copiamos el array de valores seleccionados actualmente.
    const updatedSelectedValues = [...selectedValues];

    // Si el valor ya está en el array, lo eliminamos (deselección).
    const selectedIndex = updatedSelectedValues.findIndex((item) => item.id === selectedId);
    if (selectedIndex !== -1) {
      updatedSelectedValues.splice(selectedIndex, 1);
    } else {
      // Si el valor no está en el array, lo añadimos (selección).
      updatedSelectedValues.push({ id: selectedId, name: selectedName });
    }

    // Actualizamos el estado con los nuevos valores seleccionados.
    setSelectedValues(updatedSelectedValues);

    // Llamamos a la función onChange para informar al componente padre sobre los cambios.
    onChange(updatedSelectedValues);
    toggleShowList();
  };

  const handleDeleteItem = (event, selectedId) => {
    event.stopPropagation();
    const updatedSelectedValues = [...selectedValues];
    const selectedIndex = updatedSelectedValues.findIndex((item) => item.id === selectedId);
    if (selectedIndex !== -1) {
      updatedSelectedValues.splice(selectedIndex, 1);
      setSelectedValues(updatedSelectedValues);
    }
  };

  const handleDeleteSelected = (e) => {
    e.stopPropagation();
    setSelectedValues([]);
  };

  return (
    <div className={`${styles.dropdownContainer}`}>
      {loading && <SubLoadingView />}
      {error && 'Ocurrió un error.'}
      {result && (
        <div
          className={`${styles.mainContainer}`}
          onClick={toggleShowList}
          onKeyDown={toggleShowList}
          role="menu"
          tabIndex={0}
        >
          <span className={`${styles.value}`}>
            {selectedValues.map((item) => (
              <div
                className={`${styles.selectedItem}`}
                role="button"
                tabIndex={0}
                onClick={(e) => handleDeleteItem(e, item.id)}
                onKeyDown={(e) => handleDeleteItem(e, item.id)}
              >
                <span>
                  {item.name}
                  <span>
                    {' x'}
                  </span>
                </span>
              </div>
            ))}
          </span>
          <button
            type="button"
            className={`${styles.deleteButton}`}
            name="deleteAll"
            onClick={handleDeleteSelected}
          >
            x
          </button>
          <div className={`${styles.divider}`} />
          <div className={`${styles.caret}`} />
          <ul className={`${styles.options} ${showList && styles.show}`}>
            {result
              && result.map((type) => (
                <li
                  key={type.id}
                  className={`${styles.option} ${
                    selectedValues.some((item) => item.id === type.id) && styles.selected
                  }`}
                  value={type.id}
                  onClick={(e) => handleSelectChange(e, type.id, type.name)}
                  onKeyDown={(e) => handleSelectChange(e, type.id, type.name)}
                  role="menuitem"
                >
                  {type.name}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DropdownMenuProductType;

DropdownMenuProductType.propTypes = {
  orgId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
