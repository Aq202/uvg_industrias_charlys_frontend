import { useContext, useEffect } from 'react';
import { serverHost } from '../config';
import SessionContext from '../context/SessionContext';
import useFetch from './useFetch';

function useRefreshAccessToken() {
  const { setAccessToken } = useContext(SessionContext);
  const {
    callFetch, result, error,
  } = useFetch();

  const refreshAccessToken = () => {
    const uri = `${serverHost}/session/accessToken`;
    callFetch(uri);
  };

  useEffect(() => {
    const { accessToken } = result;
    setAccessToken(accessToken);
  }, [result]);

  useEffect(() => {
    // Token invalido
    setAccessToken(null);
  }, [error]);

  return { refreshAccessToken };
}

export default useRefreshAccessToken;
