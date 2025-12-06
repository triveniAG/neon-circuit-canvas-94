import { useState } from "react";
import { Search, ArrowLeft, Cpu, Zap, Lightbulb, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CircuitBackground from "@/components/CircuitBackground";
import CircuitHeader from "@/components/CircuitHeader";
import CircuitFooter from "@/components/CircuitFooter";
import { useCircuitComponents, CircuitComponent } from "@/hooks/useCircuitComponents";
import { Link } from "react-router-dom";

const ComponentCard = ({
  component,
  isExpanded,
  onToggle,
}: {
  component: CircuitComponent;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 ${
        isExpanded ? "col-span-1 md:col-span-2" : ""
      }`}
      onClick={onToggle}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

      <div className="relative glass-panel rounded-xl p-6 h-full border border-primary/20 hover:border-primary/40 transition-colors">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
            <span className="text-lg font-display text-primary">
              {component.symbol || component.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg text-primary text-glow-subtle truncate">
              {component.name}
            </h3>
            {component.symbol && (
              <span className="text-xs text-muted-foreground font-mono">
                Symbol: {component.symbol}
              </span>
            )}
          </div>
        </div>

        {/* Brief definition (always visible) */}
        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">
          {component.definition}
        </p>

        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-primary/20 space-y-4 animate-fade-in">
            {/* Full Definition */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-primary font-display">
                <Info className="w-4 h-4" />
                <span>Definition</span>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed pl-6">
                {component.definition}
              </p>
            </div>

            {/* Applications */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-secondary font-display">
                <Zap className="w-4 h-4" />
                <span>Applications</span>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed pl-6">
                {component.application}
              </p>
            </div>

            {/* Why Used */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-accent font-display">
                <Lightbulb className="w-4 h-4" />
                <span>Why It's Used</span>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed pl-6">
                {component.why_used}
              </p>
            </div>
          </div>
        )}

        {/* Expand indicator */}
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground/50">
          {isExpanded ? "Click to collapse" : "Click to expand"}
        </div>
      </div>
    </div>
  );
};

const ComponentLibrary = () => {
  const { data: components, isLoading, error } = useCircuitComponents();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredComponents = components?.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <CircuitBackground />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      </div>

      <CircuitHeader />

      <main className="flex-1 relative z-10 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <Link to="/">
            <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Cpu className="w-10 h-10 text-primary animate-pulse-glow" />
              <h1 className="text-3xl md:text-4xl font-display font-bold text-glow">
                Component Library
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore electronic components, their symbols, applications, and learn why
              they're used in circuits
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-50" />
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-card/60 border-primary/30 focus:border-primary placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          {/* Components Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground font-display">Loading components...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive">Failed to load components. Please try again.</p>
            </div>
          ) : filteredComponents && filteredComponents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComponents.map((component) => (
                <ComponentCard
                  key={component.id}
                  component={component}
                  isExpanded={expandedId === component.id}
                  onToggle={() =>
                    setExpandedId(expandedId === component.id ? null : component.id)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Cpu className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No components found matching your search."
                  : "No components available."}
              </p>
            </div>
          )}
        </div>
      </main>

      <CircuitFooter />
    </div>
  );
};

export default ComponentLibrary;
