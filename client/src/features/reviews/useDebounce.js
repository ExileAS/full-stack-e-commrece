import { useEffect, useRef } from "react";
import debounce from "lodash.debounce";

function useDebounce(callback, delay) {
  const debouncedCallback = useRef(debounce(callback, delay));

  useEffect(() => {
    debouncedCallback.current = debounce(callback, delay);
  }, [callback, delay]);

  return debouncedCallback.current;
}

export default useDebounce;
