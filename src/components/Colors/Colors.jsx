import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useFetch from '@hooks/useFetch';
import { serverHost } from '@/config';
import styles from './Colors.module.css';
import useToken from '../../hooks/useToken';
import SubLoadingView from '../SubLoadingView/SubLoadingView';
import SearchInput from '../SearchInput/SearchInput';
import Color from './Color/Color';

function Colors({ callBack }) {
  const [query, setQuery] = useState(null);
  const token = useToken();
  const [colors, setColors] = useState([]);

  const {
    callFetch, result, error, loading,
  } = useFetch();

  const handleSearch = (val) => {
    if (val?.trim().length > 0) setQuery(val);
    else setQuery(null);
  };

  const handleSelection = (colorId, checkedValue) => {
    setColors((prevColors) => {
      const updatedColors = prevColors.map((color) => {
        if (color.id === colorId) {
          return { ...color, check: checkedValue };
        }
        return color;
      });

      return updatedColors;
    });
    const selected = colors.filter((color) => color.check);
    callBack(selected);
  };

  useEffect(() => {
    let uri = `${serverHost}/color`;

    if (query) {
      const params = new URLSearchParams({ search: query });
      uri += `?${params.toString()}`;
    }

    callFetch({ uri, headers: { authorization: token } });
  }, [query]);

  useEffect(() => {
    if (result?.length > 0) {
      setColors((prevColors) => {
        const filteredColors = prevColors.filter((color) => color.check);

        const updatedColors = filteredColors.map((color) => {
          const foundColor = result.find((resultColor) => resultColor.id === color.id);
          if (foundColor) {
            return { ...color, check: true };
          }
          return color;
        });

        const newColors = result.filter((resultColor) => (
          !updatedColors.some((color) => color.id === resultColor.id)
        ));
        return [...updatedColors, ...newColors.map((color) => ({ ...color, check: false }))];
      });
    }
  }, [result]);

  return (
    <div className={`${styles.mainContainer}`}>
      Colores
      <div className={`${styles.colorsContainer}`}>
        <div className={`${styles.searchContainer}`}>
          <SearchInput className={`${styles.searchInput}`} handleSearch={handleSearch} />
        </div>
        <ul className={`${styles.colorsList}`}>
          {error && <div className="error-message">{error?.message ?? 'Ocurrió un error.'}</div> }
          {loading && <SubLoadingView />}
          {colors?.length > 0 && !error
            && colors.map((color) => (
              <Color
                id={color.id}
                name={color.name}
                r={color.red}
                g={color.green}
                b={color.blue}
                checked={color.check}
                onClick={handleSelection}
              />
            ))}
        </ul>
      </div>
    </div>
  );
}

Colors.propTypes = {
  callBack: PropTypes.func.isRequired,
};

export default Colors;
