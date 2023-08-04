import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { scrollbarGray } from '@styles/scrollbar.module.css';
import styles from './ImagePicker.module.css';
import randomString from '../../helpers/randomString';
import ImagePickerCard from '../ImagePickerCard/ImagePickerCard';

function ImagePicker({ setImageFiles, maxFiles, className }) {
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const addImageCard = (id, image) => {
    setImagePreviews((lastVal) => ({ ...lastVal, [id]: image }));
  };

  const addFile = (id, fileImage) => {
    setFiles((lastVal) => ({ ...lastVal, [id]: fileImage }));
  };

  const deleteImage = (id) => {
    setFiles((lastVal) => {
      const value = { ...lastVal };
      delete value[id];
      return value;
    });

    setImagePreviews((lastVal) => {
      const value = { ...lastVal };
      delete value[id];
      return value;
    });
  };

  const handleOnChange = (evt) => {
    const images = evt.target.files;

    if (!images) return;
    if (Object.keys(files).length >= maxFiles) return; // max files
    Object.values(images).forEach((image) => {
      const id = randomString(10);
      const fileReader = new FileReader();

      // cargar preview de la imagen
      fileReader.onload = (event) => {
        if (event.target.readyState === 2) {
          addImageCard(id, event.target.result);
        }
      };

      fileReader.readAsDataURL(image);
      addFile(id, image);
    });
  };

  useEffect(() => {
    if (setImageFiles) setImageFiles(Object.values(files));
  }, [files]);

  return (
    <div
      className={`${className} ${styles.imagePicker} ${
        Object.entries(imagePreviews).length > 0 ? styles.galleryStyle : ''
      }`}
    >
      <div className={`${scrollbarGray} ${styles.cardsContainer}`}>
        {Object.entries(imagePreviews).map((item) => (
          <ImagePickerCard
            key={item[0]}
            id={item[0]}
            imageUrl={item[1]}
            onDelete={deleteImage}
          />
        ))}
        {
          Object.keys(files).length < maxFiles && (
          <div className={`${styles.inputFileContainer}`}>
            <div className={styles.fileInputInfo}>
              <div className={styles.uploadIcon} />
              <span className={styles.boldSpan}>Añade una foto</span>
              <span>Haz click o arrastra y suelta una imagen</span>
            </div>
            <input
              type="file"
              className={styles.inputFile}
              name="files"
              multiple
              onChange={handleOnChange}
            />
          </div>
          )
        }
      </div>
    </div>
  );
}

export default ImagePicker;

ImagePicker.propTypes = {
  setImageFiles: PropTypes.func.isRequired,
  maxFiles: PropTypes.number,
  className: PropTypes.string,
};

ImagePicker.defaultProps = {
  maxFiles: 10,
  className: '',
};
