import { Cpu, Menu, X } from "lucide-react";
import { useState } from "react";
import CircuitNav from "./CircuitNav";

const CircuitHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-50 w-full">
      {/* PCB Edge Pattern */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="glass-panel mx-4 mt-4 md:mx-8 px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Cpu className="w-7 h-7 text-primary animate-pulse-glow" />
            <div className="absolute inset-0 blur-lg bg-primary/30" />
          </div>
          <h1 className="font-display text-lg md:text-xl font-bold tracking-wider text-foreground neon-text">
            NEURAL<span className="text-secondary">CORE</span>
          </h1>
        </div>

        {/* Center - Navigation (Desktop) */}
        <div className="hidden lg:flex items-center">
          <CircuitNav />
        </div>

        {/* Right - Status Indicators */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse-glow" />
            <span>ONLINE</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-3 bg-primary/40 rounded-sm animate-waveform"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden relative p-2 text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 z-40 transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="glass-panel mx-4 mt-2 p-4 border border-primary/30">
          <nav className="flex flex-col gap-2">
            {['Systems', 'Modules', 'Network', 'Status'].map((item, i) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="flex items-center gap-3 px-4 py-3 text-sm font-mono text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-2 h-2 rounded-full bg-primary/50" />
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Connection Lines */}
      <svg className="absolute left-0 right-0 top-full h-6 w-full pointer-events-none overflow-visible">
        <line x1="10%" y1="0" x2="10%" y2="100%" className="circuit-line animate-pulse-glow" />
        <line x1="90%" y1="0" x2="90%" y2="100%" className="circuit-line animate-pulse-glow" />
        <circle cx="10%" cy="100%" r="2" fill="hsl(var(--neon-cyan))" className="animate-pulse-glow" />
        <circle cx="90%" cy="100%" r="2" fill="hsl(var(--neon-cyan))" className="animate-pulse-glow" />
      </svg>
    </header>
  );
};

export default CircuitHeader;
