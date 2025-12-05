import { Cpu } from "lucide-react";

const CircuitHeader = () => {
  return (
    <header className="relative z-10 w-full">
      {/* PCB Edge Pattern */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="glass-panel mx-4 mt-4 md:mx-8 px-6 py-4 flex items-center justify-between">
        {/* Left Circuit Decoration */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse-glow" />
            <div className="w-8 h-0.5 bg-gradient-to-r from-secondary to-transparent" />
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-3 bg-primary/30 rounded-sm"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Center Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Cpu className="w-8 h-8 text-primary animate-pulse-glow" />
            <div className="absolute inset-0 blur-lg bg-primary/30" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold tracking-wider text-foreground neon-text">
            NEURAL<span className="text-secondary">CORE</span>
          </h1>
        </div>

        {/* Right Circuit Decoration */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 border border-primary/50 rounded-sm rotate-45"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-gradient-to-l from-primary to-transparent" />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          </div>
        </div>
      </div>

      {/* Connection Lines */}
      <svg className="absolute left-0 right-0 top-full h-8 w-full pointer-events-none overflow-visible">
        <line x1="10%" y1="0" x2="10%" y2="100%" className="circuit-line animate-pulse-glow" />
        <line x1="90%" y1="0" x2="90%" y2="100%" className="circuit-line animate-pulse-glow" />
        <circle cx="10%" cy="100%" r="3" fill="hsl(var(--neon-cyan))" className="animate-pulse-glow" />
        <circle cx="90%" cy="100%" r="3" fill="hsl(var(--neon-cyan))" className="animate-pulse-glow" />
      </svg>
    </header>
  );
};

export default CircuitHeader;
