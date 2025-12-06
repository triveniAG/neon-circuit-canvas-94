const CircuitFooter = () => {
  return (
    <footer className="relative z-10 w-full mt-auto">
      {/* PCB Edge Connector Design */}
      <div className="glass-panel mx-4 md:mx-8 mb-4 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Edge Connectors */}
          <div className="flex items-center gap-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-6 rounded-sm bg-gradient-to-b from-primary/60 to-primary/20 border border-primary/30"
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
            <div className="ml-4 w-px h-6 bg-primary/30" />
          </div>

          {/* Center Credits Area */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse-glow" />
              <span className="tracking-widest">CIRCUIT VISION v1.0</span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse-glow" />
            </div>
            <div className="text-xs text-muted-foreground/80 mt-1 tracking-wider text-glow-subtle">
              Created by Abhishek Adiga T R & Triveni A G
            </div>
          </div>

          {/* Right Edge Connectors */}
          <div className="flex items-center gap-1">
            <div className="mr-4 w-px h-6 bg-primary/30" />
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-6 rounded-sm bg-gradient-to-b from-secondary/60 to-secondary/20 border border-secondary/30"
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Trace Lines */}
        <div className="mt-3 flex items-center justify-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-2 h-2 rotate-45 border border-primary/40" />
            ))}
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>
      </div>

      {/* Bottom PCB Edge Pattern */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
    </footer>
  );
};

export default CircuitFooter;
