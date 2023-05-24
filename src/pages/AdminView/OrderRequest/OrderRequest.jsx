import React, { useEffect, useState } from 'react';
import NavBar from '@components/NavBar/NavBar';
import PropTypes from 'prop-types';
// import Card from '@components/SlideCard/SlideCard';
import TextArea from '@components/TextArea/TextArea';
import InputDate from '@components/InputDate/InputDate';
import InputNumber from '@components/InputNumber/InputNumber';
import Button from '@components/Button/Button';
import Spinner from '@components/Spinner/Spinner';
import ImageViewer from '@components/ImageViewer/ImageViewer';
import { serverHost } from '@/config';
import moment from 'moment';
import useFetch from '@hooks/useFetch';
import styles from './OrderRequest.module.css';
// import useToken from '../../../hooks/useToken';

function OrderRequest({ orderId }) {
  const [form, setForm] = useState({});
  // const token = useToken();
  const {
    callFetch, result, error, loading,
  } = useFetch();

  useEffect(() => {
    callFetch({ uri: `${serverHost}/orderRequest/${orderId}`, headers: { authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVMDAwMDAwMDAwMDAwMDEiLCJuYW1lIjoiQWRtaW4iLCJsYXN0TmFtZSI6IiIsInNleCI6Ik0iLCJyb2xlIjoiQURNSU4iLCJleHAiOjE2ODQ5Njk3ODcsInR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE2ODQ4ODMzODd9.hxvI2WrrZxi1j8Qxrvtn0wtIvkLVwawm1w1xRLg61DY' } });
  }, []);

  const handleFormChange = (e) => {
    const field = e.target.name;
    const { value } = e.target;
    setForm((lastValue) => ({ ...lastValue, [field]: value }));
  };

  console.log('result: ', result);
  console.log('media:', result?.media);
  console.log('media0:', result?.media[0]);

  return (
    <div className={`${styles.OrderRequest}`}>
      <header>
        <NavBar loggedIn />
      </header>
      <main>
        <div className={`${styles.top}`}>
          <span className={`${styles.title}`}>Solicitud de pedido</span>
        </div>
        <div className={`${styles.details}`}>
          {error && 'Ocurrió un error.'}
          {loading && <Spinner />}
          <div className={`${styles.orderInfo}`}>
            <div className={`${styles.orderInfoTop}`}>
              <p>
                <strong>Cliente: </strong>
                {result?.customerName}
              </p>
              <p>
                <strong>Código: </strong>
                {result?.id}
              </p>
              <p>
                <strong>Fecha solicitada: </strong>
                {moment(result?.datePlaced).format('DD-MM-YY')}
              </p>
            </div>
            <div className={`${styles.detalles}`}>
              <strong>Detalles: </strong>
              <p>
                {result?.description}
              </p>
            </div>
            <div className={`${styles.files}`}>
              <h3>Archivos adjuntos</h3>
              <div className={`${styles.divFile}`}>
                {
                  result?.media && <ImageViewer images={result?.media} />
                  // <Card image="https://i.pinimg.com/564x/e3/f3/97/e3f39723e17d353cd53a5d6ac20f4c9f.jpg" text="imagen.png" />
                }
              </div>
            </div>
            <div className={`${styles.aditionalDetails}`}>
              <h3>Detalles adicionales</h3>
              <TextArea title="" onChange={handleFormChange} value={form?.aditionalDetails} name="aditionalDetails" />
            </div>
            <div className={`${styles.bottomForm}`}>
              <div>
                <h4>Fecha de entrega:</h4>
                <InputDate title="" onChange={handleFormChange} />
              </div>
              <div>
                <h4>Cotización inicial:</h4>
                <InputNumber title="" onChange={handleFormChange} measureUnit="Q" />
              </div>
            </div>
          </div>
          <div className={`${styles.bottom}`}>
            <Button title="" text="Rechazar pedido" type="secondary" />
            <Button title="" text="Iniciar pedido" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderRequest;

OrderRequest.propTypes = {
  orderId: PropTypes.string.isRequired,
};
