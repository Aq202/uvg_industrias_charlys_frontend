/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-spring-lightbox';
import styles from './ImageViewer.module.css';
import useApiMultipleImages from '../../hooks/useApiMultipleImages';
import Spinner from '../Spinner/Spinner';
import randomString from '../../helpers/randomString';
import useCount from '../../hooks/useCount';
import usePopUp from '../../hooks/usePopUp';

function ImageViewer({ images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { getMultipleApiImages, result, loading } = useApiMultipleImages();
  const {
    count: galleryImageIndex,
    next: nextGalleryImage,
    previous: previousGalleryImage,
    setCount: setGalleryImageIndex,
  } = useCount();

  const [isGalleryOpen, openGallery, closeGallery] = usePopUp();

  useEffect(() => {
    if (!images) return;
    getMultipleApiImages(images.map((item, index) => ({ id: index, uri: item })));
  }, [images]);

  const moveLeft = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? prevIndex : prevIndex - 1));
  };

  const moveRight = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1
      ? prevIndex : prevIndex + 1));
  };

  const handleGalleryOpen = (index) => {
    setGalleryImageIndex(index);
    openGallery();
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
              && Object.values(result).map((imgSrc, index) => (
                <div
                  key={imgSrc}
                  onClick={() => handleGalleryOpen(index)}
                  onKeyUp={() => handleGalleryOpen(index)}
                  tabIndex={0}
                  role="button"
                >
                  <img
                    src={imgSrc}
                    alt="Solicitud de pedido"

                  />
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

      <Lightbox
        isOpen={isGalleryOpen}
        onPrev={previousGalleryImage}
        onNext={nextGalleryImage}
        images={result ? Object.values(result).map((img) => ({ src: img })) : null}
        currentIndex={galleryImageIndex}
        style={{ background: '#000000aa' }}
        onClose={closeGallery}
      />
    </div>
  );
}

export default ImageViewer;

ImageViewer.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};
