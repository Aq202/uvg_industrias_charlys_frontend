import React from 'react';
import PropTypes from 'prop-types';

function inputContainer({
  titulo, tipo, placeholder, setState,
}) {
  return (
    <div className="divInput" style={{ display: 'flex', flexDirection: 'column', margin: '5px' }}>
      <span style={{ color: 'grey', textAlign: 'start', marginBottom: '10px' }}>{titulo}</span>
      <input
        type={tipo}
        placeholder={placeholder}
        style={{ borderRadius: '5px', border: '1px solid grey', padding: '5px' }}
        onChange={(e) => setState(e.target.value)}
      />
    </div>
  );
}

inputContainer.propTypes = {
  titulo: PropTypes.string.isRequired,
  tipo: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
};

export default inputContainer;
