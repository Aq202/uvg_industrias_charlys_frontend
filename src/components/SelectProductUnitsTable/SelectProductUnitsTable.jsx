import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AiFillPlusCircle as PlusIcon, AiFillCloseCircle as RemoveIcon } from 'react-icons/ai';
import { scrollbarGray } from '@styles/scrollbar.module.css';
import styles from './SelectProductUnitsTable.module.css';
import InputSelect from '../InputSelect/InputSelect';
import InputNumber from '../InputNumber/InputNumber';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { serverHost } from '../../config';
import Spinner from '../Spinner/Spinner';

/**
 * Componente para seleccionar tallas, cantidad y precio.
 * @param data. Data por default que será colocada al principio. Tomar nota que este NO es un
 * componente controlado por un estado, por lo que se recomienda que no se utilice la variable
 * de estado para el parámetro data que también será modificada por el callback onChange.
 * Es un array de objetos con la estructura [{size: "M", quantity: 50, price: 50.12}]
 * @param onChange Callback. Devuelve un arreglo de objetos como por ejemplo:
 * [{size: "M", quantity: 50, price: 50.12}]
 */
function SelectProductUnitsTable({
  data, onChange, className, showPrice,
}) {
  const {
    callFetch: fetchSizes,
    result: sizesData,
    loading: loadingSizes,
    error: errorSizes,
  } = useFetch();

  const token = useToken();

  const sizes = sizesData?.result?.map((size) => size.size);

  const [rows, setRows] = useState([{ }]);

  useEffect(() => {
    fetchSizes({ uri: `${serverHost}/generalInfo/size`, headers: { authorization: token } });
  }, []);

  useEffect(() => {
    if (data) setRows(data);
  }, [data]);

  useEffect(() => {
    if (onChange) onChange(rows);
  }, [rows]);

  const handleAddNewRow = () => {
    setRows((prevVal) => [...prevVal, {}]);
  };

  const handleRemoveRow = (index) => {
    setRows((prev) => prev.filter((val, currentIndex) => index !== currentIndex));
  };

  const getSizes = (currentSize) => sizes?.filter((size) => !rows.some((row) => row.size === size)
   || size === currentSize).map((size) => ({ title: size, value: size }));

  const handleSizeChange = (index, size) => {
    setRows((prevRows) => prevRows.map((row, currentIndex) => (index !== currentIndex
      ? row : { ...row, size })));
  };

  const handleQuantityChange = (index, quantity) => {
    setRows((prevRows) => prevRows.map((row, currentIndex) => (index !== currentIndex
      ? row : { ...row, quantity })));
  };

  const handlePriceChange = (index, price) => {
    setRows((prevRows) => prevRows.map((row, currentIndex) => (index !== currentIndex
      ? row : { ...row, price })));
  };

  return (
    <div className={`${styles.tableContainer} ${scrollbarGray} ${className}`}>
      <table className={styles.selectProductUnitsTable}>
        <thead>
          <tr>
            <th>Talla</th>
            <th>Unidad(es)</th>
            {showPrice && <th>Precio</th>}
            <th>&nbsp;</th>
          </tr>
        </thead>

        <tbody>
          {sizes
            && rows?.map((row, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={index}>
                <td>
                  <InputSelect
                    value={row.size}
                    options={getSizes(row.size)}
                    onChange={(e) => handleSizeChange(index, e.target.value)}
                    placeholder="Seleccionar talla"
                    className={styles.sizeInputSelect}
                  />
                </td>

                <td>
                  <InputNumber
                    value={row.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    step={1}
                    min={0}
                    placeholder="0"
                  />
                </td>
                {showPrice && (
                  <td>
                    <InputNumber
                      value={row.price}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      min={0}
                      placeholder="0.00"
                    />
                  </td>
                )}
                <td>
                  <button
                    type="button"
                    name="add-other-row"
                    className={styles.removeButton}
                    disabled={rows.length === 1}
                  >
                    <RemoveIcon
                      className={styles.removeIcon}
                      onClick={() => handleRemoveRow(index)}
                    />
                  </button>
                </td>
              </tr>
            ))}

          {loadingSizes && (
            <tr>
              <td colSpan={4}>
                <Spinner />
              </td>
            </tr>
          )}
          {errorSizes && (
            <tr>
              <td colSpan={4}>No se pudieron obtener las tallas de productos.</td>
            </tr>
          )}
        </tbody>
      </table>
      {rows.length < sizes?.length && (
      <button
        type="button"
        name="add-other-row"
        className={styles.addOtherButton}
        onClick={handleAddNewRow}
      >
        <PlusIcon className={styles.plusIcon} />
        Añadir otro
      </button>
      )}
    </div>
  );
}

export default SelectProductUnitsTable;

SelectProductUnitsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.string,
      quantity: PropTypes.number,
      price: PropTypes.number,
    }),
  ),
  onChange: PropTypes.func,
  className: PropTypes.string,
  showPrice: PropTypes.bool,
};

SelectProductUnitsTable.defaultProps = {
  data: [{}],
  onChange: null,
  className: '',
  showPrice: false,
};
