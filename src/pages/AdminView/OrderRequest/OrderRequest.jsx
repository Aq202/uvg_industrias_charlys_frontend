import React, { useEffect, useState } from 'react';
import NavBar from '@components/NavBar/NavBar';
import TextArea from '@components/TextArea/TextArea';
import InputDate from '@components/InputDate/InputDate';
import InputNumber from '@components/InputNumber/InputNumber';
import Button from '@components/Button/Button';
import Spinner from '@components/Spinner/Spinner';
import ImageViewer from '@components/ImageViewer/ImageViewer';
import { serverHost } from '@/config';
import moment from 'moment';
import useFetch from '@hooks/useFetch';
import { useParams } from 'react-router';
import { scrollbarGray } from '@styles/scrollbar.module.css';
import styles from './OrderRequest.module.css';
import useToken from '../../../hooks/useToken';

function OrderRequest() {
  const [form, setForm] = useState({});
  const [mostrar, setMostrar] = useState(false);
  const {
    callFetch, result, error, loading,
  } = useFetch();

  const { orderId } = useParams();
  const token = useToken();

  useEffect(() => {
    if (!orderId && !token) return;
    callFetch({
      uri: `${serverHost}/orderRequest/${orderId}`,
      headers: {
        authorization: token,
      },
    });
    setMostrar(true);
  }, [orderId, token]);

  const handleFormChange = (e) => {
    const field = e.target.name;
    const { value } = e.target;
    setForm((lastValue) => ({ ...lastValue, [field]: value }));
  };

  return (
    <div className={`${styles.OrderRequest}`}>
      <header>
        <NavBar loggedIn />
      </header>
      <main>
        <div className={`${styles.top}`}>
          <span className={`${styles.title}`}>Solicitud de pedido</span>
        </div>
        {!mostrar && 'Ha ocurrido un error.'}
        {mostrar
        && (
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
              <p>{result?.description}</p>
            </div>
            <div className={`${styles.files}`}>
              <h3>Archivos adjuntos</h3>
              <div className={`${styles.divFile} ${scrollbarGray}`}>
                {result?.media && (
                  <div className={styles.imageViewerContainer}>
                    <ImageViewer images={result?.media} />
                  </div>
                )}
              </div>
            </div>
            <div className={`${styles.aditionalDetails}`}>
              <h3>Detalles adicionales</h3>
              <TextArea
                title=""
                onChange={handleFormChange}
                value={form?.aditionalDetails}
                name="aditionalDetails"
              />
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
        )}
      </main>
    </div>
  );
}

export default OrderRequest;
