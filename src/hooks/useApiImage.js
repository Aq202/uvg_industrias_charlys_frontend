import { useState } from 'react';
import useToken from './useToken';

function useApiImage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = useToken();

  const getApiImage = async (uri) => {
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const reply = await fetch(uri, {
        headers: {
          authorization: token,
        },
      });

      if (!reply?.ok) throw reply;

      const image = await reply.blob();

      setResult(URL.createObjectURL(image));
    } catch (ex) {
      setError({ status: ex?.status, message: ex?.statusMessage ?? ex?.statusText ?? 'Ocurrió un error.' });
    } finally {
      setLoading(false);
    }
  };

  return {
    getApiImage, result, error, loading,
  };
}

export default useApiImage;
