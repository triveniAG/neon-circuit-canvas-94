import { useState, useRef, useCallback } from "react";
import { Upload, Camera, ArrowLeft, Scan, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CircuitBackground from "@/components/CircuitBackground";
import CircuitHeader from "@/components/CircuitHeader";
import CircuitFooter from "@/components/CircuitFooter";
import ImageCanvas from "@/components/ImageCanvas";
import ComponentPopup from "@/components/ComponentPopup";
import CameraScanner from "@/components/CameraScanner";
import { DetectedComponent } from "@/types/detection";
import { detectComponents } from "@/utils/detectComponents";
import { Link } from "react-router-dom";

const ScanPage = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [components, setComponents] = useState<DetectedComponent[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<DetectedComponent | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle camera capture
  const handleCameraCapture = useCallback(async (imageData: string) => {
    setShowCamera(false);
    setIsAnalyzing(true);
    setSelectedComponent(null);
    setImageUrl(imageData);

    try {
      // Convert base64 to blob for detection
      const response = await fetch(imageData);
      const blob = await response.blob();
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });

      const detectedComponents = await detectComponents(file);
      setComponents(detectedComponents);

      toast({
        title: "Analysis Complete",
        description: `Found ${detectedComponents.length} components in your circuit.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the circuit image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG)",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setSelectedComponent(null);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    try {
      // Run Google Cloud Vision detection
      const detectedComponents = await detectComponents(file);
      setComponents(detectedComponents);

      toast({
        title: "Analysis Complete",
        description: `Found ${detectedComponents.length} components in your circuit.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the circuit image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleReset = () => {
    setImageUrl(null);
    setComponents([]);
    setSelectedComponent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <CircuitBackground />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <CircuitHeader />

      <main className="flex-1 relative z-10 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link to="/">
            <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-glow mb-2">
              Circuit Scanner
            </h1>
            <p className="text-muted-foreground">
              Upload your circuit image and tap on components to learn about them
            </p>
          </div>

          {/* Scanner Content */}
          {!imageUrl ? (
            /* Upload Area */
            <div
              className="relative w-full max-w-lg mx-auto"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40 rounded-2xl blur-xl opacity-60 animate-pulse-glow" />

              <div className="relative glass-panel rounded-2xl p-12 border border-primary/30 text-center">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />

                <div className="space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Upload className="w-10 h-10 text-primary animate-pulse-glow" />
                  </div>

                  <div>
                    <h2 className="text-xl font-display text-glow-subtle mb-2">
                      Drop your circuit image here
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      or click the button below to browse
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative overflow-hidden bg-primary/20 hover:bg-primary/30 border border-primary/50 hover:border-primary text-primary transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Image
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="group relative overflow-hidden bg-secondary/10 hover:bg-secondary/20 border border-secondary/50 hover:border-secondary text-secondary transition-all"
                      onClick={() => setShowCamera(true)}
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Use Camera
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground/60">
                    Supported formats: JPG, PNG
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            /* Analysis View */
            <div className="space-y-6">
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Scan className="w-4 h-4 text-primary" />
                  <span>
                    {isAnalyzing
                      ? "Analyzing circuit..."
                      : `${components.length} components detected`}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-muted-foreground hover:text-foreground border-primary/30"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Scan New Image
                </Button>
              </div>

              {/* Image Canvas */}
              <div className="relative">
                {isAnalyzing && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 rounded-xl backdrop-blur-sm">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-primary font-display animate-pulse">
                        Analyzing circuit components...
                      </p>
                    </div>
                  </div>
                )}

                <ImageCanvas
                  imageUrl={imageUrl}
                  components={components}
                  onHotspotClick={setSelectedComponent}
                  selectedComponent={selectedComponent}
                />
              </div>

              {/* Instructions */}
              <p className="text-center text-sm text-muted-foreground">
                Tap on the glowing hotspots to learn about each component
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Component Popup */}
      {selectedComponent && (
        <ComponentPopup
          component={selectedComponent}
          onClose={() => setSelectedComponent(null)}
        />
      )}

      {/* Camera Scanner Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
          <div className="w-full max-w-4xl">
            <CameraScanner
              onCapture={handleCameraCapture}
              onClose={() => setShowCamera(false)}
            />
          </div>
        </div>
      )}

      <CircuitFooter />
    </div>
  );
};

export default ScanPage;
