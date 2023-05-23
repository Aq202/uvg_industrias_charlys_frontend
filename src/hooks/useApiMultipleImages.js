import { useEffect, useState } from 'react';
import useToken from './useToken';

function useApiMultipleImages() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pendingToLoad, setPendingToLoad] = useState(0);
  const token = useToken();

  useEffect(() => {
    if (pendingToLoad > 0) setLoading(true);
    else setLoading(false);
  }, [pendingToLoad]);

  /**
   * Permite obtener varias imagenes en simultaneo
   * @param images arreglo con objetos {id:: id imagen, uri: dirección de la imagen}.
   * @returns Hook result: se carga con un objeto {id:image}, con los diferentes :id's e imagenes.
   * @returns Hook error: consiste en un objeto {id:{status, message}}
   */
  const getMultipleApiImages = async (images) => {
    setResult(null);
    setError(null);
    setPendingToLoad(images.length);

    images.forEach((imageItem) => {
      fetch(imageItem.uri, {
        headers: {
          authorization: token,
        },
      })
        .then((reply) => {
          setPendingToLoad((val) => val - 1);
          if (!reply?.ok) throw reply;
          return reply.blob();
        })
        .then((res) => {
          // Convertir imagen a formato leible por src y agregar al objeto.
          const image = URL.createObjectURL(res);
          setResult((lastVal) => {
            if (!lastVal) return { [imageItem.id]: image };
            return { ...lastVal, [imageItem.id]: image };
          });
        })
        .catch((ex) => {
          const errObj = {
            status: ex?.status,
            message: ex?.statusMessage ?? ex?.statusText ?? 'Ocurrió un error.',
          };
          setError((lastVal) => {
            // agregar error al objeto
            if (!lastVal) return { [imageItem.id]: errObj };
            return { ...lastVal, [imageItem.id]: errObj };
          });
        });
    });
  };

  return {
    getMultipleApiImages,
    result,
    error,
    loading,
  };
}

export default useApiMultipleImages;
