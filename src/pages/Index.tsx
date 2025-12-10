import CircuitBackground from "@/components/CircuitBackground";
import CircuitHeader from "@/components/CircuitHeader";
import ScannerBox from "@/components/ScannerBox";
import StudentTestimonials from "@/components/StudentTestimonials";
import CircuitFooter from "@/components/CircuitFooter";
import { useDesktopScale } from "@/hooks/useDesktopScale";

const Index = () => {
  const { scale, shouldScale, desktopWidth } = useDesktopScale();

  return (
    <div 
      className="desktop-scale-wrapper"
      style={{
        overflowX: shouldScale ? 'auto' : 'hidden',
        overflowY: 'hidden',
      }}
    >
      <div 
        className="min-h-screen flex flex-col relative overflow-hidden"
        style={{
          width: shouldScale ? desktopWidth : '100%',
          minWidth: desktopWidth,
          transform: shouldScale ? `scale(${scale})` : 'none',
          transformOrigin: 'top left',
          height: shouldScale ? `${100 / scale}vh` : 'auto',
        }}
      >
        {/* Animated Circuit Background */}
        <CircuitBackground />

        {/* Ambient Glow Effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        </div>

        {/* Header */}
        <CircuitHeader />

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center relative z-10 py-12 px-4 gap-16">
          {/* Scanner Box */}
          <ScannerBox />
          
          {/* Student Testimonials */}
          <StudentTestimonials />
        </main>

        {/* Footer */}
        <CircuitFooter />
      </div>
    </div>
  );
};

export default Index;
