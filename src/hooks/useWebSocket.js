import { useEffect, useRef, useCallback, useState } from "react";

export const useWebSocket = (url) => {
  const ws = useRef(null);
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setConnected(true);
        reconnectAttempts.current = 0;
      };

      ws.current.onmessage = (event) => {
        try {
          setData(JSON.parse(event.data));
        } catch {
          setData(event.data);
        }
      };

      ws.current.onerror = () => {
        setConnected(false);
      };

      ws.current.onclose = () => {
        setConnected(false);
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          setTimeout(connect, 3000 * reconnectAttempts.current);
        }
      };
    } catch (err) {
      console.error("WebSocket connection error:", err);
    }
  }, [url]);

  const send = useCallback((message) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { connected, data, send, disconnect };
};
