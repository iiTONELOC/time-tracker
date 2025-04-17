import { useState, useEffect } from "preact/hooks";

export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    !isMounted && setIsMounted(true);

    return () => {
      isMounted && setIsMounted(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isMounted;
}
