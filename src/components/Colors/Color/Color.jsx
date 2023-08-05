import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Color.module.css';

function Color({
  id, name, r, g, b, check, onClick,
}) {
  const [checked, setChecked] = useState(check);

  const handleClick = () => {
    setChecked(!checked);
    onClick(id, checked);
  };

  const rgbToHex = () => {
    function componentToHex(c) {
      const hex = c.toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    }

    const hexR = componentToHex(r);
    const hexG = componentToHex(g);
    const hexB = componentToHex(b);

    return `#${hexR}${hexG}${hexB}`;
  };

  return (
    <li className={`${styles.color}`} role="presentation" onClick={handleClick} onKeyDown={handleClick}>
      <span className={`${styles.checkBoxContainer}`}>
        <span className={`${styles.checkBox}`} style={{ display: checked ? 'block' : 'none' }} />
      </span>
      <span className={`${styles.colorCircle}`} style={{ backgroundColor: `${rgbToHex()}` }} />
      <span className={`${styles.colorText}`}>
        {name}
      </span>
    </li>
  );
}

Color.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  r: PropTypes.string.isRequired,
  g: PropTypes.string.isRequired,
  b: PropTypes.string.isRequired,
  check: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Color;
