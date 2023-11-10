import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BsFillClipboardCheckFill as CompleteIcon } from 'react-icons/bs';
import { AiFillDelete as DeleteIcon } from 'react-icons/ai';
import { useNavigate } from 'react-router';
import OptionsButton from '../../../components/OptionsButton/OptionsButton';
import usePopUp from '../../../hooks/usePopUp';
import ConfirmationPopUp from '../../../components/ConfirmationPopUp/ConfirmationPopUp';
import { serverHost } from '../../../config';
import useFetch from '../../../hooks/useFetch';
import useToken from '../../../hooks/useToken';
import ErrorNotificationPopUp from '../../../components/ErrorNotificationPopUp/ErrorNotificationPopUp';
import SuccessNotificationPopUp from '../../../components/SuccessNotificationPopUp/SuccessNotificationPopUp';
import LoadingView from '../../../components/LoadingView/LoadingView';

const actions = {
  complete: 'complete',
  delete: 'delete',
};
function ProductionActionButton({ idOrder }) {
  const [action, setAction] = useState(null);

  const [isConfirmOpen, openConfirm, closeConfirm] = usePopUp();
  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();

  const {
    callFetch: fetchAction, result, loading, error,
  } = useFetch();

  const token = useToken();

  const navigate = useNavigate();

  useEffect(() => {
    if (result) openSuccess();
  }, [result]);

  useEffect(() => {
    if (error) openError();
  }, [error]);

  const completeOrderAction = () => {
    setAction(actions.complete);
    openConfirm();
  };
  const deleteOrderAction = () => {
    setAction(actions.delete);
    openConfirm();
  };

  const handleConfirm = (confirmValue) => {
    if (!confirmValue) return;

    const uri = action === actions.complete ? `${serverHost}/order/status` : `${serverHost}/order`;
    const method = action === actions.complete ? 'PUT' : 'DELETE';
    const body = {
      idOrder,
      isFinished: action === actions.complete ? true : undefined,
    };

    fetchAction({
      uri, method, body: JSON.stringify(body), headers: { authorization: token },
    });
  };

  const handleSuccessClose = () => {
    // Recargar pagina, indicando que debe actualizar
    navigate('/produccion', { state: { reload: true } });
  };

  return (
    <>
      <OptionsButton
        label="Opciones"
        options={[
          { icon: <CompleteIcon />, text: 'Finalizar', onClick: completeOrderAction },
          { icon: <DeleteIcon />, text: 'Eliminar', onClick: deleteOrderAction },
        ]}
      />

      <ConfirmationPopUp
        close={closeConfirm}
        isOpen={isConfirmOpen}
        body={actions.complete === action ? '¿Deseas marcar la orden como finalizada?' : '¿Deseas eliminar la orden?'}
        callback={handleConfirm}
      />

      <SuccessNotificationPopUp
        close={closeSuccess}
        isOpen={isSuccessOpen}
        text={actions.complete === action ? 'La orden ha sido marcada como finalizada.' : 'La orden ha sido eliminada.'}
        callback={handleSuccessClose}
      />
      <ErrorNotificationPopUp close={closeError} isOpen={isErrorOpen} text={error?.message} />

      {loading && <LoadingView />}
    </>
  );
}

export default ProductionActionButton;

ProductionActionButton.propTypes = {
  idOrder: PropTypes.string.isRequired,
};

ProductionActionButton.defaultProps = {

};
