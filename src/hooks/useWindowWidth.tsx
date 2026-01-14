import { useEffect, useMemo } from "react";
import { useThrottledState } from "@tanstack/react-pacer";

export const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useThrottledState(window.innerWidth, {
    wait: 300,
  });

  const isDesktop = useMemo(() => windowWidth >= 1024, [windowWidth]);
  const isTablet = useMemo(
    () => windowWidth >= 768 && windowWidth < 1024,
    [windowWidth]
  );
  const isMobile = useMemo(() => windowWidth < 768, [windowWidth]);

  /**
   * Handle window resize to update window width state.
   */
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setWindowWidth]);

  return { windowWidth, isDesktop, isTablet, isMobile };
};
