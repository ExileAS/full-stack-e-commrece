import { useState } from "react";
import exponentialBackoff from "./exponentialBackoff";

const useFetch = (url, options = {}, retryable = false) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  const fetchResource = async () => {
    try {
      setLoading(true);
      const res = await fetch(url, options);
      const data = await res.json();
      if (data.err) {
        setErr(data.err);
      } else {
        setData(data);
      }
      return data;
    } catch (err) {
      console.log(err);
      setErr(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchResource: retryable
      ? exponentialBackoff(fetchResource)
      : fetchResource,
    data,
    loading,
    err,
  };
};

export default useFetch;
