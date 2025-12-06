import { Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ScannerBox = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Outer Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40 rounded-2xl blur-xl opacity-60 animate-pulse-glow" />
      
      {/* Main Container */}
      <div className="relative glass-panel rounded-2xl p-8 border border-primary/30 overflow-hidden">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
        
        {/* Scanning Line Animation */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line opacity-40" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold font-display tracking-wider text-glow">
              Scan Your Circuit
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Upload or Capture Circuit Image to Analyze
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/scan">
              <Button 
                size="lg"
                className="group relative overflow-hidden bg-primary/20 hover:bg-primary/30 border border-primary/50 hover:border-primary text-primary hover:text-primary-foreground transition-all duration-300 w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                <Upload className="w-5 h-5 mr-2" />
                <span className="relative z-10">Upload Image</span>
              </Button>
            </Link>
            
            <Link to="/scan">
              <Button 
                size="lg"
                className="group relative overflow-hidden bg-secondary/20 hover:bg-secondary/30 border border-secondary/50 hover:border-secondary text-secondary hover:text-secondary-foreground transition-all duration-300 w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/20 to-secondary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                <Camera className="w-5 h-5 mr-2" />
                <span className="relative z-10">Use Scanner</span>
              </Button>
            </Link>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-muted-foreground/60 tracking-wide">
            Supported formats: JPG, PNG, PDF
          </p>
        </div>

        {/* Bottom Circuit Decoration */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/40"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScannerBox;
