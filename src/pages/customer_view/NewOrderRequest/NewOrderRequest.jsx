import React, { useState, useEffect } from 'react'
import InputContainer from '../../../components/InputContainer'
import styles from './NewOrderRequest.module.css'

function NewOrderRequest() {
  const InputsdatosCliente = [
    {
      titulo: 'Nombre', tipo: 'text', placeholder: 'Ingresa tu nombre.',
    }, {
      titulo: 'Teléfono', tipo: 'tel', placeholder: 'Ingresa tu teléfono.',
    }, {
      titulo: 'Email', tipo: 'email', placeholder: 'Ingresa tu email.',
    }, {
      titulo: 'Dirección', tipo: 'text', placeholder: 'Ingresa tu dirección.',
    },
  ]

  const [datosCliente, setDatosCliente] = useState([])

  useEffect(() => {
    setDatosCliente(InputsdatosCliente)
  }, [])

  return (
    <div className={styles.divNuevoPedido}>
      <h1>Nuevo Pedido</h1>
      <div className={styles.divDatos}>
        <h3>Datos del cliente: </h3>
        <div className={styles.divDatosCliente}>
          {
            datosCliente.map((x) => (
              <InputContainer titulo={x.titulo} tipo={x.tipo} placeholder={x.placeholder} />
            ))
          }
        </div>
        <div className={styles.divDetallesPedido}>
          <h3>Datos del pedido: </h3>
          <div className={styles.divInputDetalles} style={{ display: 'flex', flexDirection: 'column', margin: '5px' }}>
            <span style={{ color: 'grey', textAlign: 'start', marginBottom: '10px' }}>Incluye detalles como tipo de producto, cantidad, tipo de tela, color, tallas requeridas, etc.</span>
            <textarea
              type="text"
              style={
              {
                borderRadius: '5px', border: '1px solid grey', padding: '5px', minHeight: '100px', minWidth: '800px', maxHeight: '1em', maxWidth: '1em',
              }
              }
            />
            <span style={{ color: 'grey', margin: '5px', textAlign: 'start', marginBottom: '10px', marginTop: '20px' }}>Adjunta imágenes de referencia, como diseños previos y medidas.</span>
            <label className={styles.divDropContainer} htmlFor="images">
              <img src="icono_camara.svg" alt="icono_camara" />
              <span>Arrastre los archivos aquí</span>
              o
              <input
                type="file"
                id="images"
                accept="image/*, .pdf"
                multiple
                style={
                {
                  width: '350px', maxWidth: '100%', color: '#444', padding: '5px', background: '#fff', borderRadius: '10px', border: '1px solid #555',
                }
                }
              />
            </label>
          </div>
        </div>
      </div>
      <button className={styles.buttonEnviarPedido} aria-label="Send" type="submit">Enviar pedido</button>
    </div>
  )
}

export default NewOrderRequest
