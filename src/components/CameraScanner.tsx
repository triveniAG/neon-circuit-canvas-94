import { useState, useEffect, useCallback, useRef } from 'react';
import { Camera, CameraOff, RotateCcw, Aperture, AlertTriangle, RefreshCw, ChevronDown, Crosshair, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCamera } from '@/hooks/useCamera';
import { useDeviceMotion } from '@/hooks/useDeviceMotion';
import AROverlay from './AROverlay';
import CameraDevicePicker from './CameraDevicePicker';
import { detectCircuitBoard as opencvDetect, initOpenCV, DetectedBoard } from '@/utils/opencvDetection';

interface CameraScannerProps {
  onCapture: (imageData: string, region?: { x: number; y: number; width: number; height: number }) => void;
  onClose: () => void;
}

const CameraScanner = ({ onCapture, onClose }: CameraScannerProps) => {
  const {
    videoRef,
    canvasRef,
    isActive,
    isLoading,
    error,
    devices,
    selectedDevice,
    startCamera,
    stopCamera,
    switchCamera,
    captureFrame,
    captureRegion,
    getErrorDetails,
  } = useCamera();

  const { x: motionX, y: motionY, isSupported: hasGyro, requestPermission } = useDeviceMotion();
  
  const [showDevicePicker, setShowDevicePicker] = useState(false);
  const [detectedRegion, setDetectedRegion] = useState<DetectedBoard | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isOpenCVReady, setIsOpenCVReady] = useState(false);
  const [continuousDetection, setContinuousDetection] = useState(false);
  const detectionFrameRef = useRef<number | null>(null);

  // Initialize OpenCV on mount
  useEffect(() => {
    initOpenCV().then(() => {
      setIsOpenCVReady(true);
      console.log('OpenCV ready for detection');
    });
  }, []);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Request gyroscope permission on mobile
  useEffect(() => {
    if (hasGyro) {
      requestPermission();
    }
  }, [hasGyro, requestPermission]);

  // Continuous detection loop
  useEffect(() => {
    if (!continuousDetection || !isActive || !videoRef.current || !isOpenCVReady) {
      return;
    }

    const runDetection = async () => {
      if (!videoRef.current || !continuousDetection) return;
      
      try {
        const result = await opencvDetect(videoRef.current);
        if (result) {
          setDetectedRegion(result);
        }
      } catch (err) {
        console.error('Detection error:', err);
      }

      if (continuousDetection) {
        detectionFrameRef.current = requestAnimationFrame(runDetection);
      }
    };

    detectionFrameRef.current = requestAnimationFrame(runDetection);

    return () => {
      if (detectionFrameRef.current) {
        cancelAnimationFrame(detectionFrameRef.current);
      }
    };
  }, [continuousDetection, isActive, isOpenCVReady]);

  // Single frame detection with OpenCV.js
  const runSingleDetection = useCallback(async () => {
    if (!videoRef.current || !isOpenCVReady) return;

    setIsScanning(true);

    try {
      const result = await opencvDetect(videoRef.current);
      if (result) {
        setDetectedRegion(result);
      } else {
        // No board detected
        setDetectedRegion(null);
      }
    } catch (err) {
      console.error('Detection error:', err);
    } finally {
      setIsScanning(false);
    }
  }, [isOpenCVReady]);

  // Handle capture
  const handleCapture = useCallback(() => {
    if (detectedRegion) {
      const imageData = captureRegion(
        detectedRegion.x,
        detectedRegion.y,
        detectedRegion.width,
        detectedRegion.height
      );
      if (imageData) {
        onCapture(imageData, detectedRegion);
      }
    } else {
      const imageData = captureFrame();
      if (imageData) {
        onCapture(imageData);
      }
    }
  }, [captureFrame, captureRegion, detectedRegion, onCapture]);

  // Clear detection
  const clearDetection = useCallback(() => {
    setDetectedRegion(null);
  }, []);

  // Render error state
  if (error) {
    const errorDetails = getErrorDetails();
    return (
      <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
        <div className="absolute -inset-1 bg-gradient-to-r from-destructive/40 via-destructive/20 to-destructive/40 rounded-2xl blur-xl opacity-60" />
        
        <div className="relative glass-panel rounded-2xl p-8 max-w-md text-center space-y-6 border border-destructive/30">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-display text-destructive">{errorDetails?.title}</h3>
            <p className="text-muted-foreground">{errorDetails?.message}</p>
          </div>

          <div className="p-4 bg-background/50 rounded-lg border border-border/50">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Suggestion:</strong> {errorDetails?.suggestion}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => startCamera()}
              className="bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-muted-foreground/30"
            >
              Go Back
            </Button>
          </div>

          {/* HTTPS Instructions */}
          <div className="text-xs text-muted-foreground/60 space-y-1 pt-4 border-t border-border/30">
            <p className="font-medium text-muted-foreground">Running locally?</p>
            <p>Use <code className="bg-background/50 px-1 rounded">npm run dev</code> (localhost works)</p>
            <p>Or use <code className="bg-background/50 px-1 rounded">ngrok http 5173</code> for HTTPS</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {/* Parallax container */}
      <div 
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{
          transform: `perspective(1000px) rotateY(${motionX * 3}deg) rotateX(${-motionY * 3}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Outer Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40 rounded-2xl blur-xl opacity-60 animate-pulse-glow" />
        
        {/* Video Container */}
        <div className="relative glass-panel rounded-2xl overflow-hidden border border-primary/30">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary rounded-tl-lg z-20" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-primary rounded-tr-lg z-20" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-primary rounded-bl-lg z-20" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary rounded-br-lg z-20" />

          {/* Video Element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover min-h-[400px] bg-background/50"
          />

          {/* Hidden Canvas for Capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* AR Overlay */}
          {isActive && (
            <AROverlay
              isScanning={isScanning}
              detectedRegion={detectedRegion}
              onClearRegion={clearDetection}
            />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-30">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-primary font-display animate-pulse">Initializing camera...</p>
              </div>
            </div>
          )}

          {/* Controls Overlay */}
          {isActive && !isLoading && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent z-20">
              <div className="flex items-center justify-between gap-4">
                {/* Left Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onClose}
                    className="bg-background/50 backdrop-blur-sm border-primary/30 hover:bg-background/70"
                  >
                    <CameraOff className="w-4 h-4 mr-2" />
                    Close
                  </Button>

                  {devices.length > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDevicePicker(true)}
                      className="bg-background/50 backdrop-blur-sm border-primary/30 hover:bg-background/70"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Switch
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>

                {/* Center - Capture Button */}
                <Button
                  size="lg"
                  onClick={handleCapture}
                  disabled={isScanning}
                  className="relative group bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 rounded-md" />
                  <Aperture className="w-5 h-5 mr-2" />
                  {detectedRegion ? 'Capture Region' : 'Capture'}
                </Button>

                {/* Right Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setContinuousDetection(!continuousDetection)}
                    className={`backdrop-blur-sm border-secondary/30 ${
                      continuousDetection 
                        ? 'bg-secondary/40 text-secondary border-secondary' 
                        : 'bg-secondary/10 text-secondary/70 hover:bg-secondary/20'
                    }`}
                  >
                    <Zap className={`w-4 h-4 mr-2 ${continuousDetection ? 'animate-pulse' : ''}`} />
                    {continuousDetection ? 'Auto' : 'Auto'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={runSingleDetection}
                    disabled={isScanning || !isOpenCVReady}
                    className="bg-secondary/20 backdrop-blur-sm border-secondary/30 hover:bg-secondary/30 text-secondary"
                  >
                    {isScanning ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-pulse" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Crosshair className="w-4 h-4 mr-2" />
                        Detect
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Device Picker Modal */}
      {showDevicePicker && (
        <CameraDevicePicker
          devices={devices}
          selectedDevice={selectedDevice}
          onSelect={(deviceId) => {
            switchCamera(deviceId);
            setShowDevicePicker(false);
          }}
          onClose={() => setShowDevicePicker(false)}
        />
      )}
    </div>
  );
};

export default CameraScanner;
