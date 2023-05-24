/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ImageViewer.module.css';
import useApiMultipleImages from '../../hooks/useApiMultipleImages';
import Spinner from '../Spinner/Spinner';
import randomString from '../../helpers/randomString';

function ImageViewer({ images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { getMultipleApiImages, result, loading } = useApiMultipleImages();

  useEffect(() => {
    if (!images) return;
    getMultipleApiImages(images.map((item, index) => ({ id: index, uri: item })));
  }, [images]);

  const moveLeft = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? prevIndex : prevIndex - 1));
  };

  const moveRight = () => {
    setCurrentImageIndex((prevIndex) => ((prevIndex === images.length - 1)
      ? prevIndex : prevIndex + 1));
  };

  return (
    <div className={styles.imageViewer}>
      <div className={`${styles.viewerContainer}`}>
        <div className={`${styles.imagesList}`}>
          <div
            className={`${styles.carrousel}`}
            style={{
              width: `${images?.length ?? 0}00%`,
              gridTemplateColumns: `repeat(${images?.length ?? 1}, 1fr)`,
              left: `-${currentImageIndex}00%`,
            }}
          >
            {loading && (
              <div>
                <Spinner />
              </div>
            )}
            {result
              && Object.values(result).map((imgSrc) => (
                <div key={imgSrc}>
                  <img src={imgSrc} alt="Solicitud de pedido" />
                </div>
              ))}
          </div>
        </div>
        <div className={`${styles.viewerControls}`}>
          <div className={`${styles.arrowContainer}`}>
            <div
              className={`${styles.arrowButton}`}
              onClick={moveLeft}
              onKeyUp={moveLeft}
              role="button"
              tabIndex="0"
            />
          </div>
          <div className={`${styles.arrowContainer} ${styles.right}`}>
            <div
              className={`${styles.arrowButton} ${styles.right}`}
              onClick={moveRight}
              onKeyUp={moveRight}
              role="button"
              tabIndex="0"
            />
          </div>

          <div className={styles.navigationBalls}>
            {result
              && Object.values(result).map((_, index) => (
                <span
                  onClick={() => setCurrentImageIndex(index)}
                  onKeyUp={() => setCurrentImageIndex(index)}
                  className={currentImageIndex === index ? styles.selectedBall : ''}
                  role="button"
                  tabIndex="0"
                  key={randomString(10)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageViewer;

ImageViewer.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};
