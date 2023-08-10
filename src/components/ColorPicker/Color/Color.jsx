import React from 'react';
import PropTypes from 'prop-types';
import styles from './Color.module.css';

function Color({
  id, name, r, g, b, checked, onClick,
}) {
  const handleClick = () => {
    onClick(id, !checked);
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
    <li className={`${styles.color}`}>
      <label
        name={id}
        role="presentation"
        htmlFor={id}
      >
        <input id={id} className={`${styles.checkBox}`} type="checkbox" checked={checked} onChange={handleClick} />
        <span className={`${styles.colorCircle}`} style={{ backgroundColor: `${rgbToHex()}` }} />
        <span className={`${styles.colorText}`}>{name}</span>
      </label>
    </li>
  );
}

Color.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  r: PropTypes.number.isRequired,
  g: PropTypes.number.isRequired,
  b: PropTypes.number.isRequired,
  checked: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Color;
