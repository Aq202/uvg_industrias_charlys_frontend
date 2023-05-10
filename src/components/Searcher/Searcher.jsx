import React from 'react';
import styles from './Searcher.module.css';
import Button from '../Button/Button';
import Input from '../Input/Input';

function Searcher() {
  return (
    <div className={`${styles.searcher}`}>
      <Input
        onChange=""
        name="search"
        placeholder="Buscar..."
        type="text"
        required
      />
      <Button text="Buscar" onClick="" type="primary" disabled="false" />
    </div>
  );
}

export default Searcher;
