import { useState } from "react";
import { Search, ArrowLeft, Cpu, Zap, Lightbulb, Info, Tag, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CircuitBackground from "@/components/CircuitBackground";
import CircuitHeader from "@/components/CircuitHeader";
import CircuitFooter from "@/components/CircuitFooter";
import CircuitDiagram from "@/components/CircuitDiagram";
import { useCircuitComponents, CircuitComponent } from "@/hooks/useCircuitComponents";
import { Link } from "react-router-dom";

const categoryColors: Record<string, string> = {
  "Passive": "bg-blue-500/20 text-blue-300 border-blue-500/40",
  "Semiconductor": "bg-purple-500/20 text-purple-300 border-purple-500/40",
  "Integrated Circuit": "bg-green-500/20 text-green-300 border-green-500/40",
  "Electromechanical": "bg-amber-500/20 text-amber-300 border-amber-500/40",
  "Protection": "bg-red-500/20 text-red-300 border-red-500/40",
  "Sensor": "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  "Microcontroller": "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  "Display": "bg-pink-500/20 text-pink-300 border-pink-500/40",
};

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
      className={`relative group transition-all duration-500 cursor-pointer ${
        isExpanded ? "col-span-1 md:col-span-2 lg:col-span-3" : ""
      }`}
      onClick={onToggle}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

      <div className="relative glass-panel rounded-xl p-5 h-full border border-primary/20 hover:border-primary/40 transition-colors overflow-hidden">
        {/* Compact Header with Image */}
        <div className="flex items-start gap-3 mb-3">
          {/* Component Image/Symbol */}
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center shrink-0 overflow-hidden">
            {component.circuit_diagram_svg ? (
              <CircuitDiagram 
                svgContent={component.circuit_diagram_svg} 
                className="w-10 h-10"
              />
            ) : (
              <span className="text-xl font-display text-primary font-bold">
                {component.symbol || component.name.charAt(0)}
              </span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-primary text-glow-subtle truncate">
                {component.name}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                className="shrink-0 w-7 h-7 text-muted-foreground hover:text-primary"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {component.symbol && (
                <span className="text-xs text-muted-foreground font-mono bg-muted/30 px-1.5 py-0.5 rounded">
                  {component.symbol}
                </span>
              )}
              {component.category && (
                <Badge 
                  variant="outline" 
                  className={`text-xs py-0 ${categoryColors[component.category] || "bg-muted/20 text-muted-foreground border-muted/40"}`}
                >
                  {component.category}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Brief definition (always visible) */}
        <p className={`text-sm text-foreground/80 leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
          {component.definition}
        </p>

        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-5 space-y-5 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            {/* Circuit Symbol Section */}
            {component.circuit_diagram_svg && (
              <div className="bg-card/40 rounded-lg p-4 border border-primary/20">
                <h4 className="text-sm font-display text-primary mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  Circuit Symbol
                </h4>
                <div className="flex justify-center bg-background/50 rounded-lg p-4">
                  <CircuitDiagram 
                    svgContent={component.circuit_diagram_svg} 
                    className="w-40 h-20"
                  />
                </div>
              </div>
            )}

            {/* Applications & Why Used - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Applications */}
              <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20">
                <div className="flex items-center gap-2 text-sm text-secondary font-display mb-2">
                  <Zap className="w-4 h-4" />
                  <span>Applications</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {component.application}
                </p>
              </div>

              {/* Why Used */}
              <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                <div className="flex items-center gap-2 text-sm text-accent font-display mb-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>Why It is Used</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {component.why_used}
                </p>
              </div>
            </div>

            {/* Specifications */}
            {component.specifications && Object.keys(component.specifications).length > 0 && (
              <div className="bg-card/40 rounded-lg p-4 border border-primary/20">
                <h4 className="text-sm font-display text-primary mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(component.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-start text-sm bg-background/30 rounded px-2 py-1.5">
                      <span className="text-muted-foreground capitalize shrink-0">{key.replace(/_/g, " ")}:</span>
                      <span className="ml-2 text-foreground font-medium">
                        {Array.isArray(value) ? value.join(", ") : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Values */}
            {component.common_values && component.common_values.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-primary font-display">
                  <Tag className="w-4 h-4" />
                  <span>Common Part Numbers</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {component.common_values.map((value, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="bg-primary/10 text-primary border-primary/30 font-mono text-xs"
                    >
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Click hint */}
        {!isExpanded && (
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground/50 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Click for details
          </div>
        )}
      </div>
    </div>
  );
};

const ComponentLibrary = () => {
  const { data: components, isLoading, error } = useCircuitComponents();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = components 
    ? [...new Set(components.map(c => c.category).filter(Boolean))] as string[]
    : [];

  const filteredComponents = components?.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || c.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
        <div className="max-w-7xl mx-auto">
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
              Explore electronic components with detailed specifications, circuit symbols, 
              applications, and common part numbers
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-4xl mx-auto">
            {/* Search */}
            <div className="relative flex-1">
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

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "" : "border-primary/30 hover:border-primary/50"}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "" : "border-primary/30 hover:border-primary/50"}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Component count */}
          {filteredComponents && (
            <p className="text-center text-muted-foreground text-sm mb-6">
              Showing {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''}
            </p>
          )}

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
                {searchQuery || selectedCategory
                  ? "No components found matching your criteria."
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
