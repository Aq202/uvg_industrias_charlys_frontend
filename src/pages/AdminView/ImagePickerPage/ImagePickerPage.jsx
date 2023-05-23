import React, { useState } from 'react';
import ImagePicker from '../../../components/ImagePicker/ImagePicker';
import useFetch from '../../../hooks/useFetch';
import { serverHost } from '../../../config';
// import PropTypes from 'prop-types';

function ImagePickerPage() {
  const { callFetch } = useFetch();
  const [files, setFiles] = useState();
  const imageChange = (fl) => {
    setFiles(fl);
  };

  const send = () => {
    const form = new FormData();

    files?.forEach((file) => {
      form.append('file[]', file, file.name);
    });

    form.append('name', 'diego');

    callFetch({
      uri: `${serverHost}/image`,
      method: 'POST',
      body: form,
      removeContentType: true,
    });
  };

  return (
    <div>
      <ImagePicker setImageFiles={imageChange} />
      <button onClick={send} type="button">Enviar</button>
    </div>
  );
}

export default ImagePickerPage;

ImagePickerPage.propTypes = {};

ImagePickerPage.defaultProps = {};
