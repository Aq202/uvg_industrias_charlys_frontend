import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ProgressTable.module.css';
import Table from '../Table/Table';
import TableRow from '../TableRow/TableRow';
import InputNumber from '../InputNumber/InputNumber';
import Button from '../Button/Button';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import usePopUp from '../../hooks/usePopUp';
import SuccessNotificationPopUp from '../SuccessNotificationPopUp/SuccessNotificationPopUp';
import Spinner from '../Spinner/Spinner';
import ErrorNotificationPopUp from '../ErrorNotificationPopUp/ErrorNotificationPopUp';
import randomString from '../../helpers/randomString';

function ProgressTable({
  productVariants, idOrder, idProduct, onChange,
}) {
  const [productVariantsData, setProductVariantsData] = useState();
  const [localError, setLocalError] = useState(null);

  const {
    callFetch: fetchUpdateProgress, result, loading, error,
  } = useFetch();

  const token = useToken();

  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();

  useEffect(() => {
    setProductVariantsData(productVariants);
  }, [productVariants]);

  useEffect(() => {
    // Actualización exitosa
    if (result) {
      openSuccess();
    }
  }, [result]);
  useEffect(() => {
    // Actualización fallida
    if (error) openError();
  }, [error]);

  const handleCompletedQuantityChange = (e) => {
    const { name, value } = e.target;

    setLocalError(null);

    setProductVariantsData((prev) => prev.map((product) => {
      if (product.size === name) {
        return { ...product, completed: parseInt(value, 10) };
      }
      return product;
    }));
  };

  const handleUpdateProgress = () => {
    const dataToUpdate = productVariantsData.filter((product) => productVariants.some(
      (originalData) => product.size === originalData.size
      && product.completed !== originalData.completed,
    ));

    setLocalError(null);

    if (dataToUpdate.length === 0) {
      setLocalError('No hay cambios para actualizar.');
      return;
    }

    const body = {
      idOrder,
      idProduct,
      completed: dataToUpdate.map((product) => ({
        size: product.size,
        quantity: product.completed,
      })),
    };

    fetchUpdateProgress({
      uri: `${serverHost}/orderDetail`,
      method: 'PUT',
      headers: { authorization: token },
      body: JSON.stringify(body),
      parse: false,
    });
  };

  return (
    <div className={styles.progressTableContainer}>
      <Table header={['Talla', 'Cantidad', 'Progreso']} showCheckbox={false}>
        {productVariantsData?.map((product) => (
          <TableRow key={randomString()}>
            <td>{product.size}</td>
            <td>{product.quantity}</td>
            <td className={styles.completedInputRow}>
              <InputNumber
                name={product.size}
                value={`${product.completed}`}
                onChange={handleCompletedQuantityChange}
                step={1}
                min={0}
                max={product.quantity}
              />
            </td>
          </TableRow>
        ))}
      </Table>

      {localError && <p className={styles.errorMessage}>{localError}</p>}

      {!loading ? (
        <Button
          text="Actualizar progreso"
          name="update-progress-button"
          className={styles.updateProgressButton}
          onClick={handleUpdateProgress}
        />
      ) : (
        <Spinner />
      )}

      <SuccessNotificationPopUp
        close={closeSuccess}
        isOpen={isSuccessOpen}
        text="El progreso del producto ha sido actualizado."
        callback={onChange}
      />
      <ErrorNotificationPopUp close={closeError} isOpen={isErrorOpen} text={error?.message} />
    </div>
  );
}

export default ProgressTable;

ProgressTable.propTypes = {
  idOrder: PropTypes.string.isRequired,
  idProduct: PropTypes.string.isRequired,
  productVariants: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      completed: PropTypes.number.isRequired,
    }),
  ),
  onChange: PropTypes.func,
};

ProgressTable.defaultProps = {
  productVariants: null,
  onChange: null,
};
