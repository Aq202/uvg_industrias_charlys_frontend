import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './UpdateProductionStagePopUp.module.css';
import PopUp from '../PopUp/PopUp';
import OrderProgressBar from '../OrderProgressBar/OrderProgressBar';
import Button from '../Button/Button';
import useFetch from '../../hooks/useFetch';
import Spinner from '../Spinner/Spinner';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import SuccessNotificationPopUp from '../SuccessNotificationPopUp/SuccessNotificationPopUp';
import ErrorNotificationPopUp from '../ErrorNotificationPopUp/ErrorNotificationPopUp';
import usePopUp from '../../hooks/usePopUp';

function UpdateProductionStagePopUp({
  close, callback, isOpen, currentPhase, idOrder,
}) {
  const {
    callFetch: fetchUpdateStage, loading, result: updateSuccess, error,
  } = useFetch();

  const token = useToken();

  const [phase, setPhase] = useState();

  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();

  useEffect(() => {
    setPhase(currentPhase);
  }, [currentPhase]);

  useEffect(() => {
    if (updateSuccess) openSuccess();
  }, [updateSuccess]);

  useEffect(() => {
    if (error) openError();
  }, [error]);

  const handlePhaseChange = (newPhase) => {
    setPhase(newPhase);
  };

  const handleUpdateStage = () => {
    const body = {
      phase,
      idOrder,
    };
    fetchUpdateStage({
      uri: `${serverHost}/order/phase`,
      method: 'PUT',
      headers: { authorization: token },
      body: JSON.stringify(body),
    });
  };

  const handleSuccessClose = () => {
    close();
    if (callback) callback();
  };

  return (
    <>
      {isOpen && (
      <PopUp close={close} closeWithBackground={false}>
        <div className={styles.updateProductionStageContainer}>
          <h2 className={styles.title}>Actualizar fase del pedido</h2>
          <p className={styles.instructions}>
            Haz click en la fase en la que se encuentra la orden y presiona el botón de actualizar.
          </p>
          <OrderProgressBar
            className={styles.progressBar}
            useAsInput
            breakPoint="650px"
            stage={currentPhase}
            onChange={handlePhaseChange}
          />

          <div className={styles.buttonContainer}>
            {!loading && !updateSuccess && (
              <>
                <Button text="Cancelar" name="cancel-stage-update" emptyRed onClick={close} />
                <Button text="Actualizar" name="stage-update" onClick={handleUpdateStage} />
              </>
            )}

            {loading && <Spinner />}
          </div>
        </div>
      </PopUp>
      )}
      <SuccessNotificationPopUp
        close={closeSuccess}
        isOpen={isSuccessOpen}
        text="La etapa de producción de la orden ha sido actualizada."
        callback={handleSuccessClose}
      />
      <ErrorNotificationPopUp close={closeError} isOpen={isErrorOpen} text={error?.message} />
    </>
  );
}

export default UpdateProductionStagePopUp;

UpdateProductionStagePopUp.propTypes = {
  close: PropTypes.func.isRequired,
  callback: PropTypes.func,
  isOpen: PropTypes.bool,
  currentPhase: PropTypes.number,
  idOrder: PropTypes.string.isRequired,
};

UpdateProductionStagePopUp.defaultProps = {
  callback: null,
  isOpen: false,
  currentPhase: 0,
};
