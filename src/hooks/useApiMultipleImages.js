import { useEffect, useState } from 'react';
import useToken from './useToken';
import useApiFetch from './useApiFetch';

function useApiMultipleImages() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pendingImages, setPendingImages] = useState(null);
  const token = useToken();
  const { apiFetch, refreshedToken } = useApiFetch();

  /**
   * Permite obtener varias imagenes en simultaneo
   * @param images arreglo con objetos {id:: id imagen, uri: dirección de la imagen}.
   * @param forcedToken Token a utilizar. No es necesario agregarlo, a menos que no se quiera
   * utilizar el token guardado globalmente.
   * @returns Hook result: se carga con un objeto {id:image}, con los diferentes :id's e imagenes.
   * @returns Hook error: consiste en un objeto {id:{status, message}}
   */
  const getMultipleApiImages = async (images, forcedToken) => {
    setResult(null);
    setError(null);
    setLoading(true);
    setPendingImages(images);

    images.forEach((imageItem, index) => {
      apiFetch({
        uri: imageItem.uri,
        headers: { authorization: forcedToken ?? token },
        autoRefreshAccessToken: index === 0, // solo refrescar token en primera peticion
      })
        .then((reply) => {
          // retirar imagen que ya se cargó
          setPendingImages((pending) => pending.filter((item) => item.id !== imageItem.id));

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

          // Eliminar error si existe
          setError((lastVal) => {
            if (lastVal && lastVal[imageItem.id]) return ({ ...lastVal, [imageItem.id]: null });
            return lastVal;
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

  useEffect(() => {
    if (!pendingImages) return;
    if (pendingImages.length > 0) setLoading(true);
    else setLoading(false);
  }, [pendingImages]);

  useEffect(() => {
    if (!refreshedToken) return; // El token no se ha refrescado
    getMultipleApiImages(pendingImages, refreshedToken); // volver a cargar imagenes pendientes
  }, [refreshedToken]);

  return {
    getMultipleApiImages,
    result,
    error,
    loading,
  };
}

export default useApiMultipleImages;
