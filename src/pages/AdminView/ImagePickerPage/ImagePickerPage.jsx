import React, { useEffect } from 'react';
import useApiMultipleImages from '../../../hooks/useApiMultipleImages';

function ImagePickerPage() {
  const {
    getMultipleApiImages, result, loading,
  } = useApiMultipleImages();

  useEffect(() => {
    // getApiImage('/api/image/orderRequest/OR0000000000008-Doqw3NMmbNPEMGl-1684865493414.png');
    const options = [
      { id: 'img1', uri: '/api/image/orderRequest/OR0000000000008-yG2GHwxda5uXs9x-1684865490450.jpeg' },
      { id: 'img2', uri: '/api/image/orderRequest/OR0000000000008-2QzKg0rOEa25ohq-1684865492733.jpeg' },
      { id: 'img3', uri: '/api/image/orderRequest/OR0000000000008-Doqw3NMmbNPEMGl-1684865493414.png' },
      { id: 'img4', uri: '/api/image/orderRequest/OR0000000000008-m6rnT00MsIHxXiC-1684865494356.png' },
    ];
    getMultipleApiImages(options);
  }, []);

  return (
    <div>
      {loading && <span>Loading...</span>}
      {result?.img1 && <img src={result.img1} alt="result" />}
      {result?.img2 && <img src={result.img2} alt="result" />}
      {result?.img3 && <img src={result.img3} alt="result" />}
      {result?.img4 && <img src={result.img4} alt="result" />}
    </div>
  );
}

export default ImagePickerPage;

ImagePickerPage.propTypes = {};

ImagePickerPage.defaultProps = {};
