"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError } from "./api";
import {
  listClients,
  type Client,
  type ClientListResponse,
  type ListClientsParams,
} from "./clients";

type UseClientsState = {
  data: ClientListResponse | null;
  isLoading: boolean;
  error: string | null;
};

const INITIAL_STATE: UseClientsState = {
  data: null,
  isLoading: true,
  error: null,
};

export function useClients(params: ListClientsParams) {
  const [state, setState] = useState<UseClientsState>(INITIAL_STATE);
  const activeRequest = useRef(0);
  const { q, page = 1, pageSize = 20, includeArchived = false } = params;

  const load = useCallback(
    async (signal?: AbortSignal) => {
      const requestId = ++activeRequest.current;
      try {
        const response = await listClients({ q, page, pageSize, includeArchived }, signal);
        if (requestId !== activeRequest.current) return;
        setState({ data: response, isLoading: false, error: null });
      } catch (error) {
        if (requestId !== activeRequest.current) return;
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        const message =
          error instanceof ApiError ? error.message : "Nie udało się pobrać listy klientów.";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
      }
    },
    [q, page, pageSize, includeArchived]
  );

  useEffect(() => {
    const controller = new AbortController();
    // Fetch-on-mount: setState only happens after the network await, so this is
    // safe — the lint rule flags the call unconditionally.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const removeFromCache = useCallback((id: string) => {
    setState((prev) => {
      if (!prev.data) return prev;
      return {
        ...prev,
        data: {
          ...prev.data,
          items: prev.data.items.filter((item) => item.id !== id),
          total: Math.max(0, prev.data.total - 1),
        },
      };
    });
  }, []);

  const upsertInCache = useCallback((client: Client) => {
    setState((prev) => {
      if (!prev.data) return prev;
      const exists = prev.data.items.some((item) => item.id === client.id);
      const items = exists
        ? prev.data.items.map((item) => (item.id === client.id ? client : item))
        : [client, ...prev.data.items];
      return { ...prev, data: { ...prev.data, items } };
    });
  }, []);

  return {
    ...state,
    refetch: () => load(),
    removeFromCache,
    upsertInCache,
  };
}

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(handle);
  }, [value, delay]);
  return debounced;
}
