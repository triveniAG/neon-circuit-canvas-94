import { useEffect, useState } from "react";

const HolographicPanel = () => {
  const [scanPosition, setScanPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-4 md:mx-8 my-8 flex-1 flex items-center justify-center">
      {/* Outer Glow Ring */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl animate-pulse-glow" />

      {/* Main Panel Container */}
      <div className="relative w-full max-w-4xl aspect-[16/10] glass-panel rounded-2xl overflow-hidden">
        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/70 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary/70 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-primary/70 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/70 rounded-br-2xl" />

        {/* Microchip Pattern Overlay */}
        <div className="absolute inset-0 pcb-pattern opacity-30" />

        {/* Scanning Line */}
        <div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent pointer-events-none"
          style={{
            top: `${scanPosition}%`,
            boxShadow: "0 0 20px hsl(var(--neon-cyan)), 0 0 40px hsl(var(--neon-cyan) / 0.5)",
          }}
        />

        {/* Central Chip Design */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Rotating Outer Ring */}
            <div className="absolute -inset-20 border border-primary/20 rounded-full animate-rotate-slow" />
            <div className="absolute -inset-16 border border-dashed border-secondary/20 rounded-full animate-rotate-slow" style={{ animationDirection: "reverse", animationDuration: "30s" }} />

            {/* Central Chip */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 border-2 border-primary/50 bg-card/60 backdrop-blur-sm animate-float">
              {/* Chip Pins - Top */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-1 h-4 bg-gradient-to-b from-primary to-transparent" />
                ))}
              </div>
              {/* Chip Pins - Bottom */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-1 h-4 bg-gradient-to-t from-primary to-transparent" />
                ))}
              </div>
              {/* Chip Pins - Left */}
              <div className="absolute top-1/2 -left-4 -translate-y-1/2 flex flex-col gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-1 w-4 bg-gradient-to-r from-primary to-transparent" />
                ))}
              </div>
              {/* Chip Pins - Right */}
              <div className="absolute top-1/2 -right-4 -translate-y-1/2 flex flex-col gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-1 w-4 bg-gradient-to-l from-primary to-transparent" />
                ))}
              </div>

              {/* Inner Circuit Pattern */}
              <div className="absolute inset-4 border border-primary/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-display text-xs md:text-sm text-muted-foreground tracking-widest mb-2">
                    SYSTEM STATUS
                  </div>
                  <div className="font-display text-2xl md:text-3xl font-bold text-primary neon-text animate-flicker">
                    ONLINE
                  </div>
                  <div className="mt-4 flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-secondary animate-pulse-glow"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Readouts */}
        <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse-glow" />
            <span>CPU: 98.7%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span>MEM: 64.2GB</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
            <span>NET: 1.2TB/s</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 text-xs font-mono text-muted-foreground text-right space-y-1">
          <div>SECTOR: 7G-ALPHA</div>
          <div>CORE TEMP: 42°C</div>
          <div>UPTIME: 2847:32:15</div>
        </div>

        {/* Waveform Display */}
        <div className="absolute bottom-4 left-4 right-4 h-12">
          <svg className="w-full h-full" viewBox="0 0 400 50" preserveAspectRatio="none">
            <path
              d="M0,25 Q20,10 40,25 T80,25 T120,25 T160,25 T200,25 T240,25 T280,25 T320,25 T360,25 T400,25"
              fill="none"
              stroke="hsl(var(--neon-cyan))"
              strokeWidth="1"
              className="animate-pulse-glow"
            />
            <path
              d="M0,25 Q30,35 60,25 T120,25 T180,25 T240,25 T300,25 T360,25 T400,25"
              fill="none"
              stroke="hsl(var(--neon-green))"
              strokeWidth="1"
              strokeOpacity="0.5"
              className="animate-pulse-glow"
              style={{ animationDelay: "0.5s" }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HolographicPanel;
