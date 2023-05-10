import React from 'react'

const inputContainer = ({ titulo, tipo, placeholder }) => (
  <div className="divInput" style={{ display: 'flex', flexDirection: 'column', margin: '5px' }}>
    <span style={{ color: 'grey', textAlign: 'start', marginBottom: '10px' }}>{titulo}</span>
    <input type={tipo} placeholder={placeholder} style={{ borderRadius: '5px', border: '1px solid grey', padding: '5px' }} />
  </div>
)

export default inputContainer
