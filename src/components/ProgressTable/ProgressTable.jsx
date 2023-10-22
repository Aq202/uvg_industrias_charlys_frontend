import React from 'react';
import PropTypes from 'prop-types';
import styles from './ProgressTable.module.css';
import Table from '../Table/Table';
import TableRow from '../TableRow/TableRow';
import InputNumber from '../InputNumber/InputNumber';

function ProgressTable({ products }) {
  return (
    <div className={styles.progressTableContainer}>

      <Table header={['Talla', 'Cantidad', 'Progreso']}>
        {products?.map((product) => (
          <TableRow>
            <td>{product.size}</td>
            <td>{product.quantity}</td>
            <td><InputNumber value={product.completed} /></td>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}

export default ProgressTable;

ProgressTable.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    size: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    completed: PropTypes.number.isRequired,
  })),
};

ProgressTable.defaultProps = {
  products: null,
};
