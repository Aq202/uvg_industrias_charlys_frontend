import React from 'react';
import PropTypes from 'prop-types';
import PopUp from '../PopUp/PopUp';
import NewMaterialForm from '../NewMaterialForm/NewMaterialForm';

function NewMaterialFormPopUp({ close }) {
  return (
    <PopUp close={close} maxWidth={700} closeWithBackground={false} closeButton={false}>
      <NewMaterialForm close={close} onError={() => 1} onSuccess={() => 1} />
    </PopUp>
  );
}

export default NewMaterialFormPopUp;

NewMaterialFormPopUp.propTypes = {
  close: PropTypes.func.isRequired,

};

NewMaterialFormPopUp.defaultProps = {

};
