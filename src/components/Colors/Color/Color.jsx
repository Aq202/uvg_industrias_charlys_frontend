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
    <li name={id} className={`${styles.color}`} role="presentation" onClick={handleClick} onKeyDown={handleClick}>
      <input className={`${styles.checkBox}`} type="checkbox" checked={checked} />
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
  checked: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Color;
