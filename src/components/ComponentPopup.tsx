import { X, Zap, Cpu, Info, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetectedComponent } from "@/types/detection";
import { useCircuitComponent } from "@/hooks/useCircuitComponents";

interface ComponentPopupProps {
  component: DetectedComponent;
  onClose: () => void;
}

const ComponentPopup = ({ component, onClose }: ComponentPopupProps) => {
  const { data: info, isLoading } = useCircuitComponent(component.name);

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50 animate-fade-in">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-2xl blur-lg opacity-60" />

      <div className="relative glass-panel rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg text-primary text-glow">
                {component.name}
              </h3>
              {info?.symbol && (
                <span className="text-xs text-muted-foreground font-mono">
                  Symbol: {info.symbol}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : info ? (
            <>
              {/* Definition */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-primary font-display">
                  <Info className="w-4 h-4" />
                  <span>Definition</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed pl-6">
                  {info.definition}
                </p>
              </div>

              {/* Application */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-secondary font-display">
                  <Zap className="w-4 h-4" />
                  <span>Applications</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed pl-6">
                  {info.application}
                </p>
              </div>

              {/* Why Used */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-accent font-display">
                  <Lightbulb className="w-4 h-4" />
                  <span>Why It's Used</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed pl-6">
                  {info.why_used}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Component information not found in database.</p>
            </div>
          )}
        </div>

        {/* Footer with confidence */}
        {component.confidence && (
          <div className="px-4 py-2 border-t border-primary/20 bg-card/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Detection Confidence</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${component.confidence * 100}%` }}
                  />
                </div>
                <span className="text-primary font-mono">
                  {Math.round(component.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentPopup;
