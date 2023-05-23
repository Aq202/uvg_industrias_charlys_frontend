import React, { useEffect } from 'react';
import useApiImage from '../../../hooks/useApiImage';
import { serverHost } from '../../../config';

function ImagePickerPage() {
  const {
    getApiImage, result, error, loading,
  } = useApiImage();

  useEffect(() => {
    getApiImage(`${serverHost}/image/orderRequest/OR0000000000008-Doqw3NMmbNPEMGl-1684865493414.png`);
  }, []);

  return (
    <div>
      {loading && <span>Loading...</span>}
      {error && <span>{`Error: ${error.message}, status:${error.status}`}</span>}
      {result && <img src={result} alt="result" />}
    </div>
  );
}

export default ImagePickerPage;

ImagePickerPage.propTypes = {};

ImagePickerPage.defaultProps = {};
