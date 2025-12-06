import { useRef, useEffect, useState } from "react";
import { DetectedComponent } from "@/types/detection";

interface ImageCanvasProps {
  imageUrl: string;
  components: DetectedComponent[];
  onHotspotClick: (component: DetectedComponent) => void;
  selectedComponent: DetectedComponent | null;
}

const ImageCanvas = ({
  imageUrl,
  components,
  onHotspotClick,
  selectedComponent,
}: ImageCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const aspectRatio = img.height / img.width;
        const height = containerWidth * aspectRatio;
        setDimensions({ width: containerWidth, height: Math.min(height, 600) });
        setImageLoaded(true);
      }
    };
    img.src = imageUrl;
  }, [imageUrl]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-3xl mx-auto rounded-xl overflow-hidden border border-primary/30"
      style={{ height: dimensions.height || 400 }}
    >
      {/* Circuit board image */}
      <img
        src={imageUrl}
        alt="Circuit board scan"
        className="w-full h-full object-contain bg-background/50"
        style={{ display: imageLoaded ? "block" : "none" }}
      />

      {/* Loading placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/50">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Scanning overlay effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line opacity-30" />
      </div>

      {/* Hotspots */}
      {imageLoaded &&
        components.map((component, index) => {
          const x = component.x * dimensions.width;
          const y = component.y * dimensions.height;
          const isSelected =
            selectedComponent?.x === component.x &&
            selectedComponent?.y === component.y;

          return (
            <button
              key={`${component.name}-${index}`}
              onClick={() => onHotspotClick(component)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 group ${
                isSelected ? "scale-125" : "hover:scale-110"
              }`}
              style={{ left: x, top: y }}
              aria-label={`View ${component.name} details`}
            >
              {/* Outer pulse ring */}
              <div
                className={`absolute inset-0 rounded-full animate-ping ${
                  isSelected ? "bg-secondary/40" : "bg-primary/40"
                }`}
                style={{ animationDuration: "2s" }}
              />

              {/* Main hotspot */}
              <div
                className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? "bg-secondary/60 border-secondary shadow-neon-green"
                    : "bg-primary/40 border-primary shadow-neon hover:bg-primary/60"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? "bg-secondary" : "bg-primary"
                  }`}
                />
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-card/90 border border-primary/30 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-primary font-display">{component.name}</span>
                {component.confidence && (
                  <span className="text-muted-foreground ml-1">
                    {Math.round(component.confidence * 100)}%
                  </span>
                )}
              </div>
            </button>
          );
        })}

      {/* Grid overlay for tech effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10 pcb-pattern" />
    </div>
  );
};

export default ImageCanvas;
