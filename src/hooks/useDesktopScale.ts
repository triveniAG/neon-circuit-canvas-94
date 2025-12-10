import { useState, useEffect } from 'react';

const DESKTOP_WIDTH = 1280;

export function useDesktopScale() {
  const [scale, setScale] = useState(1);
  const [shouldScale, setShouldScale] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      const viewportWidth = window.innerWidth;
      if (viewportWidth < DESKTOP_WIDTH) {
        setScale(viewportWidth / DESKTOP_WIDTH);
        setShouldScale(true);
      } else {
        setScale(1);
        setShouldScale(false);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return { scale, shouldScale, desktopWidth: DESKTOP_WIDTH };
}
