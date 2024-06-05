import { useEffect, useState } from "react";
export default function useLoaclstorage(initialState, key) {
  const [value, setValue] = useState(function() {
    const storedval = localStorage.getItem(key);
    return storedval ? JSON.parse(storedval) : initialState;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);
  return [value, setValue];
}
