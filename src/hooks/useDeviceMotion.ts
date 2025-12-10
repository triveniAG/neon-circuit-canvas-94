import { useState, useEffect, useCallback } from 'react';

interface MotionState {
  x: number;
  y: number;
  isSupported: boolean;
  isEnabled: boolean;
  permissionState: 'prompt' | 'granted' | 'denied' | 'unknown';
}

export function useDeviceMotion() {
  const [motion, setMotion] = useState<MotionState>({
    x: 0,
    y: 0,
    isSupported: false,
    isEnabled: false,
    permissionState: 'unknown',
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Check if device orientation is supported
  useEffect(() => {
    const isSupported = 'DeviceOrientationEvent' in window;
    setMotion((prev) => ({ ...prev, isSupported }));
  }, []);

  // Request permission for iOS 13+
  const requestPermission = useCallback(async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        setMotion((prev) => ({
          ...prev,
          permissionState: permission,
          isEnabled: permission === 'granted',
        }));
        return permission === 'granted';
      } catch (error) {
        console.error('Device orientation permission error:', error);
        setMotion((prev) => ({ ...prev, permissionState: 'denied' }));
        return false;
      }
    } else {
      // No permission required
      setMotion((prev) => ({ ...prev, permissionState: 'granted', isEnabled: true }));
      return true;
    }
  }, []);

  // Handle device orientation
  useEffect(() => {
    if (!motion.isEnabled) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const x = (event.gamma || 0) / 45; // Left-right tilt, normalized to -1 to 1
      const y = (event.beta || 0) / 45;  // Front-back tilt, normalized

      // Clamp values
      setMotion((prev) => ({
        ...prev,
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y - 0.5)), // Adjust for natural phone holding position
      }));
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [motion.isEnabled]);

  // Mouse fallback for desktop
  useEffect(() => {
    if (motion.isEnabled && motion.isSupported) return; // Use gyroscope if available

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      
      setMousePosition({ x, y });
      setMotion((prev) => ({
        ...prev,
        x: x * 0.3, // Reduce intensity for mouse
        y: y * 0.3,
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [motion.isEnabled, motion.isSupported]);

  return {
    ...motion,
    mousePosition,
    requestPermission,
  };
}
