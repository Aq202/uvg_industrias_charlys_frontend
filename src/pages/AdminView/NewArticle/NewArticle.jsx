/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import NavBar from '@components/NavBar/NavBar';
import InputRadio from '@components/InputRadio/InputRadio';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import InputText from '../../../components/InputText/InputText';
import styles from './NewArticle.module.css';
import InputNumber from '../../../components/InputNumber/InputNumber';
import Button from '../../../components/Button/Button';
import useToken from '../../../hooks/useToken';
import InputSelect from '../../../components/InputSelect/InputSelect';
import Spinner from '../../../components/Spinner/Spinner';

function NewArticle() {
  const {
    callFetch, result, error, loading,
  } = useFetch();
  const token = useToken();

  const [type, setType] = useState('');
  const [descMaterial, setDescMaterial] = useState('');
  const [amount, setAmount] = useState('');
  const [nameFabric, setNameFabric] = useState('');
  const [colorFabric, setColorFabric] = useState('');
  const [nameProduct, setNameProduct] = useState('');
  const [colorProduct, setColorProduct] = useState('');
  const [typeProduct, setTypeProduct] = useState('');
  const [sizeProduct, setSizeProduct] = useState('');
  const [clientProduct, setClientProduct] = useState('');
  const [disabledButton, setDisabledButton] = useState(true);
  const [measureUnit, setMeasureUnit] = useState('');

  const newArticle = () => {
    switch (type) {
      /* ----------------- Material -----------------*/
      case 'material':
        callFetch({
          uri: `${serverHost}/inventory`,
          method: 'POST',
          body: JSON.stringify(
            {
              fabrica: null,
              producto: null,
              size: null,
              quantity: amount,
              measurementUnit: measureUnit,
            },
          ),
          headers: { authorization: token },
        });
        callFetch({
          uri: `${serverHost}/generalInfo/material`,
          method: 'POST',
          body: JSON.stringify(
            {
              description: descMaterial,
            },
          ),
          headers: { authorization: token },
        });
        break;
        /* ----------------- Fabrica -----------------*/
      case 'fabrica':
        callFetch({
          uri: `${serverHost}/inventory`,
          method: 'POST',
          body: JSON.stringify(
            {
              material: null,
              producto: null,
              size: null,
              quantity: amount,
              measurementUnit: measureUnit,
            },
          ),
          headers: { authorization: token },
        });
        callFetch({
          uri: `${serverHost}/generalInfo/fabric`,
          method: 'POST',
          body: JSON.stringify(
            {
              fabric: nameFabric,
              color: colorFabric,
            },
          ),
          headers: { authorization: token },
        });
        break;
        /* ----------------- Producto -----------------*/
      case 'producto':
        callFetch({
          uri: `${serverHost}/inventory`,
          method: 'POST',
          body: JSON.stringify(
            {
              material: null,
              fabrica: null,
              size: null,
              quantity: amount,
              measurementUnit: measureUnit,
            },
          ),
          headers: { authorization: token },
        });
        callFetch({
          uri: `${serverHost}/product/type`,
          body: JSON.stringify(
            {
              name: typeProduct,
            },
          ),
          headers: { authorization: token },
        });
        callFetch({
          uri: `${serverHost}/product/type`,
          body: JSON.stringify(
            {
              client: clientProduct,
              color: colorProduct,
            },
          ),
          headers: { authorization: token },
        });
        callFetch({
          uri: `${serverHost}/product/requirement`,
          body: JSON.stringify(
            {
              material: null,
              quantityPerUnit: amount,
            },
          ),
          headers: { authorization: token },
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if ((type === 'material' && descMaterial !== '' && amount !== '' && measureUnit !== '')
    || (type === 'fabrica' && nameFabric !== '' && colorFabric !== '' && amount !== '' && measureUnit !== '')
    || (type === 'producto' && nameProduct !== '' && colorProduct !== '' && typeProduct !== ''
    && sizeProduct !== '' && clientProduct !== '' && amount !== '' && measureUnit !== '')) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [type, descMaterial, amount, nameFabric, colorFabric,
    nameProduct, colorProduct, typeProduct, sizeProduct,
    clientProduct]);

  useEffect(() => {
    setDescMaterial('');
    setNameFabric('');
    setColorFabric('');
    setNameProduct('');
    setColorProduct('');
    setTypeProduct('');
    setSizeProduct('');
    setClientProduct('');
  }, [type]);

  useEffect(() => {
    callFetch({ uri: `${serverHost}/generalInfo/size`, headers: { authorization: token } });
  }, []);

  return (
    <div className={`${styles.newArticle}`}>
      <header>
        <NavBar loggedIn />
      </header>

      {loading && <Spinner />}
      {
        true
      && (
      <form className={`${styles.formArticle}`}>
        <div>
          <InputRadio
            title="Categoría"
            options={[
              { title: 'Material', value: 'material' },
              { title: 'Fabrica', value: 'fabrica' },
              { title: 'Producto', value: 'producto' },
            ]}
            value={type}
            onChange={(e) => setType(e.target.value)}
            name="category"
          />
        </div>
        {type === 'material' && (
        <div className={`${styles.material}`}>
          <InputText
            title="Descripcion"
            value={descMaterial}
            onChange={(e) => setDescMaterial(e.target.value)}
            name="descMaterial"
          />
          <InputNumber
            title="Cantidad"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            name="amount"
          />
          <InputText
            title="Unidad de medida"
            value={measureUnit}
            onChange={(e) => setMeasureUnit(e.target.value)}
            name="measure"
          />
        </div>
        )}
        {type === 'fabrica' && (
        <div className={`${styles.fabric}`}>
          <div>
            <InputText
              title="Nombre"
              value={nameFabric}
              onChange={(e) => setNameFabric(e.target.value)}
              name="nameFabric"
            />
            <InputText
              title="Color"
              value={colorFabric}
              onChange={(e) => setColorFabric(e.target.value)}
              name="colorFabric"
            />
          </div>
          <div>
            <InputNumber
              title="Cantidad"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              name="amount"
            />
            <InputText
              title="Unidad de medida"
              value={measureUnit}
              onChange={(e) => setMeasureUnit(e.target.value)}
              name="measure"
            />
          </div>
        </div>
        )}
        {type === 'producto' && (
        <div className={`${styles.product}`}>
          <div>
            <InputText
              title="Nombre"
              value={nameProduct}
              onChange={(e) => setNameProduct(e.target.value)}
              name="nameProduct"
            />
            <InputText
              title="Tipo"
              value={typeProduct}
              onChange={(e) => setTypeProduct(e.target.value)}
              name="typeProduct"
            />
            <InputSelect
              title="Talla"
              value={sizeProduct}
              onChange={(e) => setSizeProduct(e.target.value)}
              name="sizeProduct"
              options={result}
            />
          </div>
          <div>
            <InputText
              title="Color"
              value={colorProduct}
              onChange={(e) => setColorProduct(e.target.value)}
              name="colorProduct"
            />
            <InputNumber
              title="Cantidad"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              name="amount"
            />
            <InputText
              title="Unidad de medida"
              value={measureUnit}
              onChange={(e) => setMeasureUnit(e.target.value)}
              name="measure"
            />
          </div>
          <div>
            <InputText
              title="Cliente"
              value={clientProduct}
              onChange={(e) => setClientProduct(e.target.value)}
              name="typeProduct"
            />
          </div>
        </div>
        )}
        <div className={`${styles.button}`}>
          {!loading && <Button text="Enviar" disabled={disabledButton} onClick={newArticle} />}
          {loading && <Spinner />}
        </div>
      </form>
      )
      }
    </div>
  );
}

export default NewArticle;
