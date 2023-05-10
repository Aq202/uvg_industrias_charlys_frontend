import { useContext, useEffect } from 'react';
import SessionContext from '@context/SessionContext';
import useFetch from './useFetch';
import { serverHost } from '../config';

function useAccessToken() {
  const {
    callFetch, result, error, loading,
  } = useFetch();
  const { accessToken, setAccessToken } = useContext(SessionContext);

  const getAccessToken = async () => {
    const uri = `${serverHost}/session/accessToken`;
    callFetch({ uri });
  };

  useEffect(() => {
    if (!result) return;
    setAccessToken(result.accessToken);
  }, [result]);

  useEffect(() => {
    if (!error) return;
    setAccessToken(null);
  }, [error]);

  return {
    getAccessToken, accessToken, error, loading,
  };
}
export default useAccessToken;
