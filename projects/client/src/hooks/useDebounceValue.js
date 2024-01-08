import { useEffect, useState } from "react";

function useDebounceValue(value, time = 350) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, time);

    return () => {
      clearTimeout(timer);
    };
  }, [value, time]);

  return debounceValue;
}

export default useDebounceValue;
