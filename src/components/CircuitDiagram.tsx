interface CircuitDiagramProps {
  svgContent: string;
  className?: string;
}

const CircuitDiagram = ({ svgContent, className = "" }: CircuitDiagramProps) => {
  return (
    <div 
      className={`text-primary ${className}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default CircuitDiagram;
