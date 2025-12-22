import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface DetectedBoard {
  x: number;
  y: number;
  width: number;
  height: number;
  contour?: number[][];
  confidence?: number;
}

interface AROverlayProps {
  isScanning: boolean;
  detectedRegion: DetectedBoard | null;
  onClearRegion: () => void;
}

const AROverlay = ({ isScanning, detectedRegion, onClearRegion }: AROverlayProps) => {
  const [scanPosition, setScanPosition] = useState(0);

  // Animate scanning line
  useEffect(() => {
    if (!isScanning) {
      setScanPosition(0);
      return;
    }

    const interval = setInterval(() => {
      setScanPosition((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 30);

    return () => clearInterval(interval);
  }, [isScanning]);

  // Generate SVG path from contour points
  const getContourPath = (contour: number[][]): string => {
    if (!contour || contour.length < 3) return '';
    
    const path = contour.map((point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${point[0]} ${point[1]}`;
    }).join(' ');
    
    return `${path} Z`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Scanning Frame */}
      <div className="absolute inset-8 border-2 border-primary/30 rounded-lg">
        {/* Animated Corners */}
        <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-primary animate-pulse" />
        <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-primary animate-pulse" style={{ animationDelay: '0.6s' }} />

        {/* Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="border border-primary/30" />
          ))}
        </div>
      </div>

      {/* Scanning Line */}
      {isScanning && (
        <div
          className="absolute left-8 right-8 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent"
          style={{
            top: `${8 + (scanPosition / 100) * 84}%`,
            boxShadow: '0 0 20px 4px hsl(var(--secondary) / 0.5)',
          }}
        />
      )}

      {/* Horizontal Scan Lines Effect */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="h-px bg-primary"
            style={{ 
              marginTop: `${i * 5}%`,
              animation: `scan-flicker ${0.5 + Math.random() * 1}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Data Readout Effect */}
      <div className="absolute top-4 left-4 text-xs font-mono text-primary/60 space-y-1">
        <div className="animate-pulse">OPENCV_DETECT v4.10</div>
        <div>RES: 1280x720</div>
        <div className={isScanning ? 'animate-pulse text-secondary' : ''}>
          STATUS: {isScanning ? 'ANALYZING...' : detectedRegion ? 'BOARD DETECTED' : 'READY'}
        </div>
        {detectedRegion?.confidence && (
          <div className="text-secondary">
            CONF: {Math.round(detectedRegion.confidence * 100)}%
          </div>
        )}
      </div>

      {/* FPS Counter */}
      <div className="absolute top-4 right-4 text-xs font-mono text-primary/60">
        <div>30 FPS</div>
        <div>OPENCV.JS</div>
      </div>

      {/* Detected Region with Contour Polygon */}
      {detectedRegion && (
        <>
          {/* SVG overlay for contour polygon */}
          {detectedRegion.contour && detectedRegion.contour.length >= 3 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Outer glow */}
              <path
                d={getContourPath(detectedRegion.contour)}
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth="4"
                strokeLinejoin="round"
                opacity="0.3"
                filter="url(#glow)"
              />
              
              {/* Main contour line */}
              <path
                d={getContourPath(detectedRegion.contour)}
                fill="hsl(var(--secondary) / 0.1)"
                stroke="hsl(var(--secondary))"
                strokeWidth="2"
                strokeLinejoin="round"
                className="animate-pulse"
              />
              
              {/* Corner dots */}
              {detectedRegion.contour.map((point, index) => (
                <circle
                  key={index}
                  cx={point[0]}
                  cy={point[1]}
                  r="6"
                  fill="hsl(var(--secondary))"
                  stroke="hsl(var(--background))"
                  strokeWidth="2"
                />
              ))}
            </svg>
          )}

          {/* Bounding box overlay */}
          <div
            className="absolute border-2 border-secondary/50 rounded-lg pointer-events-auto"
            style={{
              left: detectedRegion.x,
              top: detectedRegion.y,
              width: detectedRegion.width,
              height: detectedRegion.height,
              boxShadow: '0 0 30px 8px hsl(var(--secondary) / 0.2), inset 0 0 30px 8px hsl(var(--secondary) / 0.05)',
            }}
          >
            {/* Label */}
            <div className="absolute -top-8 left-0 bg-secondary/90 text-secondary-foreground text-xs px-2 py-1 rounded font-mono flex items-center gap-2">
              <span>CIRCUIT BOARD</span>
              {detectedRegion.confidence && (
                <span className="opacity-70">
                  {Math.round(detectedRegion.confidence * 100)}%
                </span>
              )}
            </div>

            {/* Clear button */}
            <button
              onClick={onClearRegion}
              className="absolute -top-3 -right-3 w-6 h-6 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              <X className="w-3 h-3 text-secondary-foreground" />
            </button>

            {/* Dimension labels */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-secondary/80">
              {Math.round(detectedRegion.width)}px × {Math.round(detectedRegion.height)}px
            </div>
          </div>
        </>
      )}

      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, hsl(var(--background) / 0.5) 100%)',
        }}
      />

      {/* Noise overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default AROverlay;
