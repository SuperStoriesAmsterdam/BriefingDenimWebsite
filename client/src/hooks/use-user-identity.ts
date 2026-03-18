import { useState, useCallback } from "react";

const STORAGE_KEY = "dc-prd-username";

export function useUserIdentity() {
  const [name, setNameState] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY);
  });

  const setName = useCallback((n: string) => {
    localStorage.setItem(STORAGE_KEY, n);
    setNameState(n);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setNameState(null);
  }, []);

  return { name, setName, clear };
}
