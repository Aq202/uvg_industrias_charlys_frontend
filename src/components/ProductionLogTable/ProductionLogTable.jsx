import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { serverHost } from '../../config';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import Table from '../Table/Table';
import TableRow from '../TableRow/TableRow';
import randomString from '../../helpers/randomString';
import styles from './ProductionLogTable.module.css';

function ProductionLogTable({ orderId, productId }) {
  const token = useToken();
  const {
    callFetch, result, loading,
  } = useFetch();

  useEffect(() => {
    if (!token) return;
    const body = {};
    body.idProducts = productId;

    callFetch({
      uri: `${serverHost}/orderDetail/log/${orderId}/${productId}`,
      headers: { authorization: token },
    });
  }, [token]);

  return (
    <div className={styles.mainContainer}>
      <Table header={['Fecha', 'Talla', 'Detalle']} showCheckbox={false} loading={loading}>
        {result?.logs.map((log) => (
          <TableRow key={randomString()}>
            <td>{moment(log.date).format('DD/MM/YYYY')}</td>
            <td>{log.size}</td>
            <td>{log.description}</td>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}

export default ProductionLogTable;

ProductionLogTable.propTypes = {
  orderId: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
};
