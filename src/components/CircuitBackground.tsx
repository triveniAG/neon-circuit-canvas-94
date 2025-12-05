import { useEffect, useRef } from "react";

const CircuitBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Circuit nodes and connections
    const nodes: { x: number; y: number; connections: number[] }[] = [];
    const particles: { x: number; y: number; targetNode: number; progress: number; speed: number; trail: { x: number; y: number }[] }[] = [];

    // Generate circuit grid
    const gridSize = 80;
    const cols = Math.ceil(canvas.width / gridSize) + 1;
    const rows = Math.ceil(canvas.height / gridSize) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (Math.random() > 0.4) {
          nodes.push({
            x: i * gridSize + (Math.random() - 0.5) * 30,
            y: j * gridSize + (Math.random() - 0.5) * 30,
            connections: [],
          });
        }
      }
    }

    // Create connections
    nodes.forEach((node, i) => {
      nodes.forEach((other, j) => {
        if (i !== j) {
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist < gridSize * 1.8 && Math.random() > 0.6) {
            node.connections.push(j);
          }
        }
      });
    });

    // Create particles
    for (let i = 0; i < 30; i++) {
      const startNode = Math.floor(Math.random() * nodes.length);
      if (nodes[startNode]?.connections.length > 0) {
        particles.push({
          x: nodes[startNode].x,
          y: nodes[startNode].y,
          targetNode: nodes[startNode].connections[Math.floor(Math.random() * nodes[startNode].connections.length)],
          progress: 0,
          speed: 0.005 + Math.random() * 0.01,
          trail: [],
        });
      }
    }

    const animate = () => {
      ctx.fillStyle = "rgba(8, 12, 18, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw circuit traces
      ctx.strokeStyle = "rgba(0, 180, 180, 0.15)";
      ctx.lineWidth = 1;
      nodes.forEach((node) => {
        node.connections.forEach((connIdx) => {
          const target = nodes[connIdx];
          if (target) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            // Create right-angle connections for PCB look
            const midX = (node.x + target.x) / 2;
            if (Math.random() > 0.5) {
              ctx.lineTo(midX, node.y);
              ctx.lineTo(midX, target.y);
            }
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes (connection points)
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 255, 0.3)";
        ctx.fill();
      });

      // Update and draw particles
      particles.forEach((particle) => {
        const startNode = nodes.find((_, i) => 
          nodes[i]?.connections.includes(particle.targetNode) && 
          Math.hypot(nodes[i].x - particle.x, nodes[i].y - particle.y) < 10
        ) || nodes[Math.floor(Math.random() * nodes.length)];
        
        const targetNode = nodes[particle.targetNode];
        
        if (startNode && targetNode) {
          particle.progress += particle.speed;
          
          // Store trail
          particle.trail.push({ x: particle.x, y: particle.y });
          if (particle.trail.length > 20) particle.trail.shift();
          
          // Lerp position
          particle.x = startNode.x + (targetNode.x - startNode.x) * particle.progress;
          particle.y = startNode.y + (targetNode.y - startNode.y) * particle.progress;

          // Draw trail
          ctx.beginPath();
          particle.trail.forEach((pos, i) => {
            if (i === 0) ctx.moveTo(pos.x, pos.y);
            else ctx.lineTo(pos.x, pos.y);
          });
          ctx.strokeStyle = `rgba(0, 255, 255, ${0.3})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#00ffff";
          ctx.shadowColor = "#00ffff";
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Reset at target
          if (particle.progress >= 1) {
            particle.progress = 0;
            particle.trail = [];
            const currentNode = nodes[particle.targetNode];
            if (currentNode && currentNode.connections.length > 0) {
              particle.targetNode = currentNode.connections[Math.floor(Math.random() * currentNode.connections.length)];
            }
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "linear-gradient(135deg, hsl(220 20% 4%) 0%, hsl(220 25% 8%) 100%)" }}
    />
  );
};

export default CircuitBackground;
