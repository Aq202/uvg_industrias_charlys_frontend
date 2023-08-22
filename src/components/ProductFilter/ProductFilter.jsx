import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { IoIosArrowDown as DownArrow } from 'react-icons/io';
import AnimateHeight from 'react-animate-height';
import { scrollbarGray } from '@styles/scrollbar.module.css';
import styles from './ProductFilter.module.css';
import useToogle from '../../hooks/useToogle';
import SearchInput from '../SearchInput/SearchInput';
import CheckboxItem from '../CheckboxItem/CheckboxItem';
import useToken from '../../hooks/useToken';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import CheckboxColorItem from '../CheckboxColorItem/CheckboxColorItem';

function ProductFilter({ idOrganization, onChange, className }) {
  const [showTypeFilter, toogleTypeFilter] = useToogle(true);
  const [showColorFilter, toogleColorFilter] = useToogle(true);

  const [typeFilter, setTypeFilter] = useState([]);
  const [colorFilter, setColorFilter] = useState([]);
  const [query, setQuery] = useState(null);

  const token = useToken();

  const { callFetch: getTypesFetch, result: types } = useFetch();
  const { callFetch: getColorsFetch, result: colors } = useFetch();

  useEffect(() => {
    if (!token && !idOrganization) return;

    getTypesFetch({
      uri: `${serverHost}/product/type/by-organization/${idOrganization}`,
      headers: { authorization: token },
    });
    getColorsFetch({
      uri: `${serverHost}/color/by-organization/${idOrganization}`,
      headers: { authorization: token },
    });
  }, [token, idOrganization]);

  useEffect(() => {
    if (onChange) onChange({ types: typeFilter, colors: colorFilter, query });
  }, [typeFilter, colorFilter, query]);

  const handleTypeOptionChange = (e) => {
    const { value, checked } = e.target;

    if (checked) setTypeFilter((prev) => Array.from(new Set([...prev, value])));
    else setTypeFilter((prev) => prev.filter((val) => val !== value));
  };
  const handleColorOptionChange = (e) => {
    const { value, checked } = e.target;

    if (checked) setColorFilter((prev) => Array.from(new Set([...prev, value])));
    else setColorFilter((prev) => prev.filter((val) => val !== value));
  };
  return (
    <div className={className}>
      <div className={styles.productFilterContainer}>
        <h3 className={styles.generalTitle}>Filtros</h3>
        <SearchInput className={styles.searchBar} handleSearch={(val) => setQuery(val)} />
        <div className={styles.sectionsContainer}>
          <div className={styles.filterSection}>
            <div
              className={styles.sectionHeader}
              onClick={toogleTypeFilter}
              onKeyUp={toogleTypeFilter}
              role="button"
              tabIndex="0"
            >
              <h4>Tipo</h4>
              <DownArrow className={`${styles.sectionArrow} ${!showTypeFilter ? styles.up : ''}`} />
            </div>
            <AnimateHeight height={showTypeFilter ? 'auto' : 0} className={`${styles.itemContainer} ${scrollbarGray}`}>
              {types?.map((item) => (
                <CheckboxItem
                  key={item.id}
                  onChange={handleTypeOptionChange}
                  value={item.id}
                  checked={typeFilter.includes(item.id)}
                >
                  {item.name}
                </CheckboxItem>
              ))}
            </AnimateHeight>
          </div>
          <div className={styles.filterSection}>
            <div
              className={styles.sectionHeader}
              onClick={toogleColorFilter}
              onKeyUp={toogleColorFilter}
              role="button"
              tabIndex="0"
            >
              <h4>Color</h4>
              <DownArrow className={`${styles.sectionArrow} ${!showColorFilter ? styles.up : ''}`} />
            </div>
            <AnimateHeight height={showColorFilter ? 'auto' : 0} className={`${styles.itemContainer} ${scrollbarGray}`}>
              {colors?.map((item) => (
                <CheckboxColorItem
                  key={item.id}
                  onChange={handleColorOptionChange}
                  value={item.id}
                  checked={colorFilter.includes(item.id)}
                  colorName={item.name}
                  red={item.red}
                  green={item.green}
                  blue={item.blue}
                />
              ))}

            </AnimateHeight>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;

ProductFilter.propTypes = {
  idOrganization: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

ProductFilter.defaultProps = {
  onChange: null,
  className: '',
};
