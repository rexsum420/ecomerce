import { useState, useEffect } from "react";
import Api from "./Api";

const useFetchList = (endpoint, method = 'GET', body = null, authenticate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await Api(endpoint, method, body, authenticate);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, method, body, authenticate]);

  return { data, loading, error };
}

export default useFetchList;