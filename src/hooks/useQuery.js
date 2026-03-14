import { useState, useCallback } from "react";
import api from "../services/api";

export const useQuery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const query = useCallback(async (question, documentIds = []) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.post("/api/query", {
        question,
        documentIds,
      });
      setResponse(result.data.data);
      return result.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const clearResponse = useCallback(() => setResponse(null), []);

  return { query, loading, error, response, clearError, clearResponse };
};
