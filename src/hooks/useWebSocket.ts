import { useEffect, useRef, useState, useCallback } from "react";

type WSState = "CONNECTING" | "OPEN" | "CLOSED" | "ERROR";

export function useWebSocket<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [state, setState] = useState<WSState>("CLOSED");
  const wsRef = useRef<WebSocket | null>(null);
  const retriesRef = useRef(0);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(`ws://localhost:8000${path}`);
      wsRef.current = ws;
      setState("CONNECTING");

      ws.onopen = () => { setState("OPEN"); retriesRef.current = 0; };
      ws.onmessage = (e) => {
        try { setData(JSON.parse(e.data)); } catch {}
      };
      ws.onerror = () => setState("ERROR");
      ws.onclose = () => {
        setState("CLOSED");
        const delay = Math.min(1000 * 2 ** retriesRef.current, 30000);
        retriesRef.current++;
        setTimeout(connect, delay);
      };
    } catch {
      setState("ERROR");
    }
  }, [path]);

  useEffect(() => {
    connect();
    return () => { wsRef.current?.close(); };
  }, [connect]);

  return { data, state };
}
