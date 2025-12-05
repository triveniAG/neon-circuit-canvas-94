import { useState } from "react";
import { ChevronDown, Cpu, Database, Shield, Zap, Terminal, Settings, Users, Activity } from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: { label: string; href: string; icon: React.ReactNode; description: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Systems",
    icon: <Cpu className="w-4 h-4" />,
    children: [
      { label: "Core Processing", href: "#core", icon: <Cpu className="w-4 h-4" />, description: "Neural network hub" },
      { label: "Data Matrix", href: "#matrix", icon: <Database className="w-4 h-4" />, description: "Storage clusters" },
      { label: "Security Grid", href: "#security", icon: <Shield className="w-4 h-4" />, description: "Firewall systems" },
    ],
  },
  {
    label: "Modules",
    icon: <Zap className="w-4 h-4" />,
    children: [
      { label: "Power Core", href: "#power", icon: <Zap className="w-4 h-4" />, description: "Energy management" },
      { label: "Terminal Access", href: "#terminal", icon: <Terminal className="w-4 h-4" />, description: "Command interface" },
      { label: "Diagnostics", href: "#diagnostics", icon: <Activity className="w-4 h-4" />, description: "System monitoring" },
    ],
  },
  {
    label: "Network",
    icon: <Users className="w-4 h-4" />,
    children: [
      { label: "User Matrix", href: "#users", icon: <Users className="w-4 h-4" />, description: "Connected nodes" },
      { label: "Configuration", href: "#config", icon: <Settings className="w-4 h-4" />, description: "System parameters" },
    ],
  },
  {
    label: "Status",
    href: "#status",
    icon: <Activity className="w-4 h-4" />,
  },
];

const CircuitNav = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="relative flex items-center gap-1">
      {navItems.map((item) => (
        <div
          key={item.label}
          className="relative"
          onMouseEnter={() => item.children && setActiveDropdown(item.label)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          {/* Nav Button */}
          <button
            className="group relative flex items-center gap-2 px-4 py-2 text-sm font-mono tracking-wider text-muted-foreground transition-all duration-300 hover:text-primary"
          >
            {/* Hover glow background */}
            <div className="absolute inset-0 rounded-md bg-primary/0 group-hover:bg-primary/10 transition-all duration-300" />
            
            {/* Circuit trace left */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-transparent group-hover:w-2 transition-all duration-300" />
            
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-primary/50 group-hover:text-primary transition-colors duration-300">
                {item.icon}
              </span>
              {item.label}
              {item.children && (
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180 text-primary' : ''}`} />
              )}
            </span>
            
            {/* Circuit trace right */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-gradient-to-l from-secondary to-transparent group-hover:w-2 transition-all duration-300" />
            
            {/* Bottom indicator line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-gradient-to-r from-primary via-secondary to-primary group-hover:w-full transition-all duration-300" />
            
            {/* Corner nodes */}
            <div className="absolute bottom-0 left-0 w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-all duration-300" />
            <div className="absolute bottom-0 right-0 w-1 h-1 rounded-full bg-secondary/0 group-hover:bg-secondary transition-all duration-300" />
          </button>

          {/* Dropdown Menu */}
          {item.children && (
            <div
              className={`absolute top-full left-0 pt-2 z-50 transition-all duration-300 ${
                activeDropdown === item.label
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
            >
              {/* Circuit pathway connection */}
              <svg className="absolute -top-2 left-6 w-0.5 h-4 overflow-visible">
                <line x1="0" y1="0" x2="0" y2="16" className="stroke-primary stroke-[2]" strokeDasharray="4 2">
                  <animate attributeName="stroke-dashoffset" values="0;6" dur="0.5s" repeatCount="indefinite" />
                </line>
                <circle cx="0" cy="16" r="2" fill="hsl(var(--primary))" className="animate-pulse-glow" />
              </svg>

              <div className="glass-panel min-w-64 p-1 border border-primary/30 overflow-hidden">
                {/* Top circuit decoration */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
                
                {/* Dropdown items */}
                <div className="relative z-10">
                  {item.children.map((child, index) => (
                    <a
                      key={child.label}
                      href={child.href}
                      className="group/item relative flex items-start gap-3 px-4 py-3 transition-all duration-300 hover:bg-primary/10 rounded-md"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Left circuit trace */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-px bg-primary group-hover/item:w-2 transition-all duration-200" />
                      
                      {/* Icon container */}
                      <div className="relative flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md border border-primary/30 bg-background/50 group-hover/item:border-primary group-hover/item:shadow-[0_0_10px_hsl(var(--primary)/0.5)] transition-all duration-300">
                        <span className="text-primary/50 group-hover/item:text-primary transition-colors">
                          {child.icon}
                        </span>
                        {/* Corner dots */}
                        <div className="absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full bg-primary/0 group-hover/item:bg-primary transition-all duration-300" />
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-mono text-foreground group-hover/item:text-primary transition-colors">
                          {child.label}
                        </span>
                        <span className="text-xs text-muted-foreground/70 font-mono">
                          {child.description}
                        </span>
                      </div>

                      {/* Data flow indicator */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                        <div className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
                        <div className="w-1 h-1 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1 h-1 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </a>
                  ))}
                </div>

                {/* Bottom circuit decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-transparent to-secondary" />
                
                {/* Side traces */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-transparent to-secondary opacity-50" />
                <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-transparent to-primary opacity-50" />
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default CircuitNav;
