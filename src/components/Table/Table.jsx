import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { scrollbarGray } from '@styles/scrollbar.module.css';
import { Pagination } from '@mui/material';
import styles from './Table.module.css';
import Spinner from '../Spinner/Spinner';
import randomString from '../../helpers/randomString';

/**
 * Componente para crear las tablas del proyecto.
 *
 * Sigue la siguiente estructura:
 *
 * <Table>
 *  <TableRow>
 *    <td>valor fila </td>
 *  </TableRow>
 * </Table>
 *
 * @param header lista de strings con los encabezados de la tabla.
 * @param breakPoint max-width en el que se aplica el estilo mobile.
 * @param maxCellWidth max-width de las celdas de la tabla
 * @param showCheckbox boolean. Mostrar los check para seleccionar filas.
 * @param onSelectedRowsChange callback que devuelve las filas seleccionadas.
 * @param className clase a aplicar al contenedor de la tabla.
 * @param numOfPages Total de páginas a desplegar en el componente de paginación. Si no se
 * especifíca un número, no se muestra la paginación.
 * @param currentPage Página actual. Las páginas inician con el índice cero.
 * @param handlePageChange Función callback que se va a ejecutar cuando se cambie de página.
 * Esta función devuelve en su parámetro la página nueva seleccionada.
 *
 *
 */
function Table({
  header,
  children,
  breakPoint,
  maxCellWidth,
  showCheckbox,
  onSelectedRowsChange,
  className,
  loading,
  numOfPages,
  currentPage,
  handlePageChange,
}) {
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [useVerticalStyle, setUseVerticalStyle] = useState(false);

  const containerRef = useRef();
  const tableRef = useRef();

  const handleSelect = (id, selected) => {
    if (selected) setSelectedRowsId((prev) => Array.from(new Set([...prev, id])));
    else setSelectedRowsId((prev) => prev.filter((val) => val !== id));
  };

  const handleSelectAll = (e) => {
    // se ejecuta cuando se modifica manualmente el checkbox del encabezado
    const { checked } = e.target;

    if (checked) {
      // seleccionar todos
      setSelectedRowsId(React.Children.map(children, (item) => item.props.id));
    } else setSelectedRowsId([]); // vaciar todos
  };

  const pageChange = (e, page) => {
    if (handlePageChange) handlePageChange(page - 1);
  };

  useEffect(() => {
    // media query para cambiar el estilo
    const mediaQuery = window.matchMedia(`(max-width: ${breakPoint})`);

    const handleMediaChange = (e) => {
      setUseVerticalStyle(e.matches);
    };
    mediaQuery.onchange = handleMediaChange;

    // initial change
    handleMediaChange(mediaQuery);
  }, []);

  useEffect(() => {
    if (onSelectedRowsChange) onSelectedRowsChange(selectedRowsId);
  }, [selectedRowsId]);

  return (
    <div
      className={`${styles.tableContainer} ${scrollbarGray} ${
        useVerticalStyle ? styles.verticalDesign : ''
      } ${className}`}
      ref={containerRef}
    >
      <table className={`${styles.table} `} ref={tableRef}>
        <thead>
          <tr>
            {showCheckbox && (
              <td className={styles.checkboxCell}>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRowsId.length === (children?.length ?? 1)}
                />
              </td>
            )}
            {header?.map((val) => (
              <td key={randomString()} style={{ maxWidth: maxCellWidth }}>
                {val}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td className={styles.completeRow} colSpan={(header?.length ?? 0) + 1}>
                <Spinner />
              </td>
            </tr>
          )}

          {!loading && !children && (
            <tr>
              <td
                className={`${styles.completeRow} ${styles.noResults}`}
                colSpan={(header?.length ?? 0) + 1}
              >
                No hay resultados.
              </td>
            </tr>
          )}

          {React.Children.map(children, (child) => {
            if (child) {
              return React.cloneElement(child, {
                onSelect: handleSelect,
                checked: selectedRowsId.includes(child?.props.id),
                header,
                useVerticalStyle,
                maxCellWidth: child?.props.maxCellWidth ?? maxCellWidth,
                showCheckbox,
              });
            }
            return null;
          })}
        </tbody>
        <tfoot />
      </table>

      {numOfPages && (
        <div className={styles.paginationContainer}>
          <Pagination
            count={numOfPages}
            siblingCount={2}
            className={styles.pagination}
            onChange={pageChange}
            page={currentPage + 1}
          />
        </div>
      )}
    </div>
  );
}

export default Table;

Table.propTypes = {
  header: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node,
  breakPoint: PropTypes.string,
  maxCellWidth: PropTypes.string,
  showCheckbox: PropTypes.bool,
  onSelectedRowsChange: PropTypes.func,
  className: PropTypes.string,
  loading: PropTypes.bool,
  numOfPages: PropTypes.number,
  currentPage: PropTypes.number,
  handlePageChange: PropTypes.func,
};

Table.defaultProps = {
  children: null,
  breakPoint: '600px',
  maxCellWidth: null,
  showCheckbox: true,
  onSelectedRowsChange: null,
  className: '',
  loading: false,
  numOfPages: null,
  currentPage: 0,
  handlePageChange: null,
};
