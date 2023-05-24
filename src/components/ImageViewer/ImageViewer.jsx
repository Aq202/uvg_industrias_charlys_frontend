/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './ImageViewer.module.css';
import Image from './Image';

function ImageViewer({ images }) {
  const [imagenes, setImagenes] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setImagenes(images);
  }, []);

  const moveLeft = () => {
    setIndex((prevIndex) => (prevIndex === 0 ? imagenes.length - 1 : prevIndex - 1));
  };

  const moveRight = () => {
    setIndex((prevIndex) => (prevIndex === imagenes.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className={`${styles.viewerContainer}`}>
      <div className={`${styles.imagesList}`}>
        <div className={`${styles.carrousel}`}>
          <div>
            {imagenes.map((imagen) => {
              console.log(index);
              return <Image imageId={imagen} />;
            })}
          </div>
        </div>
      </div>
      <div className={`${styles.viewerControls}`}>
        <div className={`${styles.arrowContainerLeft}`}>
          <div className={`${styles.arrowButtonLeft}`} {...addEventListener('click', () => moveLeft())} />
        </div>
        <div className={`${styles.arrowContainerRight}`}>
          <div className={`${styles.arrowButtonRight}`} {...addEventListener('click', () => moveRight())} />
        </div>
      </div>
    </div>
  );
}

export default ImageViewer;

ImageViewer.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};
