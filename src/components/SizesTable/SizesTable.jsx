import React from 'react';
import PropTypes from 'prop-types';
import randomId from '@helpers/randomString';
import styles from './SizesTable.module.css';

function SizesTable({ sizesArray }) {
    return(
        <div className={styles.sizesTableContainer}>
            <div className={styles.sizesTable}>
                <div className={styles.tableColumn}>
                    
                </div>
            </div>
        </div>
    )
}

SizesTable.proptypes = {
  sizesArray: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SizesTable;
