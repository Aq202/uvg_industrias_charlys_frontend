import { useState } from 'react';

function useFetch() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const callFetch = async ({
    uri, method = 'GET', body, headers, signal, toJson = true, parse = true, removeContentType = false,
  }) => {
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const heads = {
        'Content-Type': 'application/json',
        ...headers,
      };
      if (removeContentType) delete heads['Content-Type'];

      const reply = await fetch(uri, {
        method,
        body,
        headers: heads,
        signal,
        credentials: 'include',
      });

      if (!reply?.ok) throw reply;

      let res;
      if (!parse) res = reply;
      else if (toJson) res = await reply.json();
      else res = await reply.text();

      setResult(res ?? true);
    } catch (ex) {
      setError({ status: ex?.status, message: ex?.statusMessage ?? ex?.statusText ?? 'Ocurrió un error.' });
    } finally {
      setLoading(false);
    }
  };

  return {
    callFetch, result, error, loading,
  };
}

export default useFetch;
