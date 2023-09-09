import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InputDate from '@components/InputDate/InputDate';
import styles from './DateSearch.module.css';

function DateSearch({ onSearch }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  useEffect(() => {
    onSearch(startDate, endDate);
  }, [startDate, endDate]);

  return (
    <div className={styles.mainContainer}>
      <InputDate
        title="Fecha de inicio"
        value={startDate}
        onChange={handleStartDateChange}
      />
      <InputDate
        title="Fecha de fin"
        value={endDate}
        onChange={handleEndDateChange}
      />
    </div>
  );
}

export default DateSearch;

DateSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
