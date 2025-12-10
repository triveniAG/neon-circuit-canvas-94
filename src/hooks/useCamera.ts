import { useState, useRef, useCallback, useEffect } from 'react';

export type CameraError = 
  | 'NotAllowedError' 
  | 'NotFoundError' 
  | 'NotReadableError' 
  | 'OverconstrainedError'
  | 'SecurityError'
  | 'AbortError'
  | 'UnknownError';

export interface CameraDevice {
  deviceId: string;
  label: string;
  kind: 'videoinput';
}

export interface CameraState {
  isActive: boolean;
  isLoading: boolean;
  error: CameraError | null;
  errorMessage: string | null;
  devices: CameraDevice[];
  selectedDevice: string | null;
  stream: MediaStream | null;
}

const ERROR_MESSAGES: Record<CameraError, { title: string; message: string; suggestion: string }> = {
  NotAllowedError: {
    title: 'Camera Access Denied',
    message: 'You have blocked camera access for this site.',
    suggestion: 'Please allow camera access in your browser settings, then refresh the page.',
  },
  NotFoundError: {
    title: 'No Camera Found',
    message: 'No camera device was detected on your device.',
    suggestion: 'Please connect a camera and try again.',
  },
  NotReadableError: {
    title: 'Camera In Use',
    message: 'The camera is already being used by another application.',
    suggestion: 'Close other apps using the camera and try again.',
  },
  OverconstrainedError: {
    title: 'Camera Not Supported',
    message: 'Your camera does not support the required settings.',
    suggestion: 'Try selecting a different camera if available.',
  },
  SecurityError: {
    title: 'Security Error',
    message: 'Camera access requires a secure connection (HTTPS).',
    suggestion: 'Access this site via HTTPS or localhost.',
  },
  AbortError: {
    title: 'Camera Aborted',
    message: 'Camera access was interrupted.',
    suggestion: 'Please try again.',
  },
  UnknownError: {
    title: 'Camera Error',
    message: 'An unexpected error occurred while accessing the camera.',
    suggestion: 'Please refresh the page and try again.',
  },
};

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [state, setState] = useState<CameraState>({
    isActive: false,
    isLoading: false,
    error: null,
    errorMessage: null,
    devices: [],
    selectedDevice: null,
    stream: null,
  });

  // Enumerate available cameras
  const enumerateDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter((device) => device.kind === 'videoinput')
        .map((device, index) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${index + 1}`,
          kind: 'videoinput' as const,
        }));
      
      setState((prev) => ({ ...prev, devices: videoDevices }));
      return videoDevices;
    } catch (error) {
      console.error('Failed to enumerate devices:', error);
      return [];
    }
  }, []);

  // Get error type from error object
  const getErrorType = (error: unknown): CameraError => {
    if (error instanceof DOMException) {
      switch (error.name) {
        case 'NotAllowedError':
        case 'PermissionDeniedError':
          return 'NotAllowedError';
        case 'NotFoundError':
        case 'DevicesNotFoundError':
          return 'NotFoundError';
        case 'NotReadableError':
        case 'TrackStartError':
          return 'NotReadableError';
        case 'OverconstrainedError':
        case 'ConstraintNotSatisfiedError':
          return 'OverconstrainedError';
        case 'SecurityError':
          return 'SecurityError';
        case 'AbortError':
          return 'AbortError';
        default:
          return 'UnknownError';
      }
    }
    return 'UnknownError';
  };

  // Start camera with specified device or default
  const startCamera = useCallback(async (deviceId?: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null, errorMessage: null }));

    // Check if mediaDevices is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'SecurityError',
        errorMessage: ERROR_MESSAGES.SecurityError.message,
      }));
      return false;
    }

    try {
      // Try to get camera with ideal constraints
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: deviceId ? undefined : 'environment',
        },
        audio: false,
      };

      let stream: MediaStream;
      
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (firstError) {
        // Fallback to basic constraints if ideal fails
        console.log('Falling back to basic constraints');
        stream = await navigator.mediaDevices.getUserMedia({
          video: deviceId ? { deviceId: { exact: deviceId } } : true,
          audio: false,
        });
      }

      // Enumerate devices after getting permission (labels are now available)
      await enumerateDevices();

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const videoTrack = stream.getVideoTracks()[0];
      const selectedDeviceId = videoTrack?.getSettings().deviceId || deviceId || null;

      setState((prev) => ({
        ...prev,
        isActive: true,
        isLoading: false,
        stream,
        selectedDevice: selectedDeviceId,
        error: null,
        errorMessage: null,
      }));

      return true;
    } catch (error) {
      console.error('Camera error:', error);
      const errorType = getErrorType(error);
      const errorInfo = ERROR_MESSAGES[errorType];
      
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorType,
        errorMessage: errorInfo.message,
      }));

      return false;
    }
  }, [enumerateDevices]);

  // Stop camera and release all resources
  const stopCamera = useCallback(() => {
    if (state.stream) {
      state.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setState((prev) => ({
      ...prev,
      isActive: false,
      stream: null,
    }));
  }, [state.stream]);

  // Switch to a different camera
  const switchCamera = useCallback(async (deviceId: string) => {
    stopCamera();
    await startCamera(deviceId);
  }, [stopCamera, startCamera]);

  // Capture current frame
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL('image/jpeg', 0.9);
  }, []);

  // Capture cropped region
  const captureRegion = useCallback((
    x: number,
    y: number,
    width: number,
    height: number
  ): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    // Scale coordinates to video dimensions
    const scaleX = video.videoWidth / video.clientWidth;
    const scaleY = video.videoHeight / video.clientHeight;

    canvas.width = width * scaleX;
    canvas.height = height * scaleY;
    
    ctx.drawImage(
      video,
      x * scaleX,
      y * scaleY,
      width * scaleX,
      height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return canvas.toDataURL('image/jpeg', 0.9);
  }, []);

  // Get error details for display
  const getErrorDetails = useCallback(() => {
    if (!state.error) return null;
    return ERROR_MESSAGES[state.error];
  }, [state.error]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (state.stream) {
        state.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Initial device enumeration
  useEffect(() => {
    enumerateDevices();
  }, [enumerateDevices]);

  return {
    videoRef,
    canvasRef,
    ...state,
    startCamera,
    stopCamera,
    switchCamera,
    captureFrame,
    captureRegion,
    enumerateDevices,
    getErrorDetails,
  };
}
