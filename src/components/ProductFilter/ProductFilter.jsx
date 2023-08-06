import React from 'react';
// import PropTypes from 'prop-types';
import { IoIosArrowDown as DownArrow } from 'react-icons/io';
import AnimateHeight from 'react-animate-height';
import styles from './ProductFilter.module.css';
import useToogle from '../../hooks/useToogle';

function ProductFilter() {
  const [showTypeFilter, toogleTypeFilter] = useToogle(true);
  return (
    <div className={styles.productFilter}>
      <div className={styles.productFilterContainer}>
        <h3 className={styles.generalTitle}>Filtros</h3>
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
          <AnimateHeight height={showTypeFilter ? 'auto' : 0}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque sunt sequi
            recusandae sit sint dignissimos corporis optio in enim, nisi asperiores. Illo illum
            nobis, sint totam debitis tempore necessitatibus labore.
          </AnimateHeight>
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;

ProductFilter.propTypes = {};

ProductFilter.defaultProps = {};
