import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

interface UseSocketOptions {
  url?: string;
  autoConnect?: boolean;
}

interface UseSocketReturn {
  socket: Socket | null;
  status: ConnectionStatus;
  lastUpdate: string | null;
  subscribe: (event: string, callback: (...args: any[]) => void) => () => void;
  requestRefresh: () => void;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const { url = SOCKET_URL, autoConnect = true } = options;
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    if (!autoConnect) return;

    const socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setStatus('connected');
      console.log('[Socket] Connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      setStatus('disconnected');
      console.log('[Socket] Disconnected:', reason);
    });

    socket.on('reconnect_attempt', (attempt) => {
      setStatus('connecting');
      console.log('[Socket] Reconnecting... attempt', attempt);
    });

    socket.on('reconnect', () => {
      setStatus('connected');
      console.log('[Socket] Reconnected');
    });

    socket.on('connect_error', (err) => {
      setStatus('disconnected');
      console.warn('[Socket] Connection error:', err.message);
    });

    socket.on('data:update', (data) => {
      if (data?.timestamp) {
        setLastUpdate(data.timestamp);
      }
    });

    socket.on('data:initial', (data) => {
      if (data?.timestamp) {
        setLastUpdate(data.timestamp);
      }
    });

    return () => {
      socket.removeAllListeners();
      socket.close();
      socketRef.current = null;
    };
  }, [url, autoConnect]);

  const subscribe = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      const socket = socketRef.current;
      if (!socket) return () => {};

      socket.on(event, callback);
      return () => {
        socket.off(event, callback);
      };
    },
    []
  );

  const requestRefresh = useCallback(() => {
    socketRef.current?.emit('data:request-refresh');
  }, []);

  return {
    socket: socketRef.current,
    status,
    lastUpdate,
    subscribe,
    requestRefresh,
  };
}
