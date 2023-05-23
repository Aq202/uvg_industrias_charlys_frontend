import React, { useEffect, useState } from 'react';
import NavBar from '@components/NavBar/NavBar';
import Card from '@components/SlideCard/SlideCard';
import TextArea from '@components/TextArea/TextArea';
import InputDate from '@components/InputDate/InputDate';
import InputNumber from '@components/InputNumber/InputNumber';
import Button from '@components/Button/Button';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import styles from './OrderRequest.module.css';
import useToken from '../../../hooks/useToken';
import Spinner from '../../../components/Spinner/Spinner';

function OrderRequest() {
  const [form, setForm] = useState({});
  const token = useToken();
  const {
    callFetch, result, error, loading,
  } = useFetch();

  useEffect(() => {
    callFetch({ uri: `${serverHost}/orderRequest`, headers: { authorization: token } });
  }, []);

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
        <div className={`${styles.details}`}>
          {error && 'Ocurrió un error.'}
          {loading && <Spinner />}
          <div className={`${styles.orderInfo}`}>
            <div className={`${styles.orderInfoTop}`}>
              <span className={`${styles.topInfo}`}>Cliente: </span>
              {result?.client}
              <span className={`${styles.topInfo}`}>Código: </span>
              {result?.code}
              <span className={`${styles.topInfo}`}>Fecha solicitada: </span>
              {result?.dateRequest}
              <span className={`${styles.topInfo}`}>Detalles: </span>
              {result?.details}
            </div>
            <div className={`${styles.files}`}>
              <h3>Archivos adjuntos</h3>
              <div className={`${styles.divFile}`}>
                <Card image="https://i.pinimg.com/564x/e3/f3/97/e3f39723e17d353cd53a5d6ac20f4c9f.jpg" text="imagen.png" />
              </div>
            </div>
            <div className={`${styles.aditionalDetails}`}>
              <h3>Detalles adicionales</h3>
              <TextArea title="" onChange={handleFormChange} value={form?.aditionalDetails} name="aditionalDetails" />
            </div>
            <div className={`${styles.bottomForm}`}>
              <div>
                <h4>Fecha de entrega:</h4>
                <InputDate onChange={handleFormChange} />
              </div>
              <div>
                <h4>Cotización inicial:</h4>
                <InputNumber onChange={handleFormChange} measureUnit="Q" />
              </div>
            </div>
          </div>
          <div className={`${styles.bottom}`}>
            <Button text="Rechazar pedido" type="secondary" />
            <Button text="Iniciar pedido" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderRequest;
