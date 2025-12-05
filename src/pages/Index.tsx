import CircuitBackground from "@/components/CircuitBackground";
import CircuitHeader from "@/components/CircuitHeader";
import HolographicPanel from "@/components/HolographicPanel";
import CircuitFooter from "@/components/CircuitFooter";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Circuit Background */}
      <CircuitBackground />

      {/* Ambient Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <CircuitHeader />

      {/* Main Holographic Panel */}
      <main className="flex-1 flex items-center justify-center relative z-10 py-8">
        <HolographicPanel />
      </main>

      {/* Footer */}
      <CircuitFooter />
    </div>
  );
};

export default Index;
