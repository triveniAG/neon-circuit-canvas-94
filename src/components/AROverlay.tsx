import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface AROverlayProps {
  isScanning: boolean;
  detectedRegion: { x: number; y: number; width: number; height: number } | null;
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
        <div className="animate-pulse">CIRCUIT_SCAN v2.1</div>
        <div>RES: 1280x720</div>
        <div className={isScanning ? 'animate-pulse text-secondary' : ''}>
          STATUS: {isScanning ? 'SCANNING...' : detectedRegion ? 'BOARD DETECTED' : 'READY'}
        </div>
      </div>

      {/* FPS Counter */}
      <div className="absolute top-4 right-4 text-xs font-mono text-primary/60">
        <div>30 FPS</div>
        <div>LAT: 12ms</div>
      </div>

      {/* Detected Region Highlight */}
      {detectedRegion && (
        <div
          className="absolute border-2 border-secondary rounded-lg pointer-events-auto"
          style={{
            left: detectedRegion.x,
            top: detectedRegion.y,
            width: detectedRegion.width,
            height: detectedRegion.height,
            boxShadow: '0 0 30px 8px hsl(var(--secondary) / 0.3), inset 0 0 30px 8px hsl(var(--secondary) / 0.1)',
          }}
        >
          {/* Animated border effect */}
          <div className="absolute inset-0 border border-secondary/50 rounded-lg animate-pulse" />
          
          {/* Corner markers */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-secondary" />
          <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-secondary" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-secondary" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-secondary" />

          {/* Label */}
          <div className="absolute -top-8 left-0 bg-secondary/90 text-secondary-foreground text-xs px-2 py-1 rounded font-mono">
            CIRCUIT BOARD DETECTED
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
