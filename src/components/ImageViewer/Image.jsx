/* eslint-disable no-restricted-globals */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '@components/Spinner/Spinner';
import useApiImage from '@hooks/useApiImage';

function ImageViewer({ imageId }) {
  const {
    getApiImage, result, error, loading,
  } = useApiImage();

  useEffect(() => {
    getApiImage({ imageId });
  }, []);

  console.log('image: ', imageId);

  return (
    <div>
      {error && 'Ocurrió un error.'}
      {loading && <Spinner />}
      {result && <img src={result} alt="imagen" />}
      {console.log('Type result: ', typeof result)}
      {console.log('result: ', result)}
    </div>
  );
}

export default ImageViewer;

ImageViewer.propTypes = {
  imageId: PropTypes.string.isRequired,
};
