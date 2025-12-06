import { DetectedComponent } from "@/types/detection";

// Mock detection - simulates component detection on circuit images
// In production, replace with actual ML API call
const componentLabels = [
  "Resistor",
  "Capacitor",
  "Transistor",
  "Diode",
  "LED",
  "Inductor",
  "Integrated Circuit",
  "Transformer",
];

export const mockDetectComponents = async (
  imageFile: File
): Promise<DetectedComponent[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate random number of detected components (3-8)
  const numComponents = Math.floor(Math.random() * 6) + 3;
  const components: DetectedComponent[] = [];

  for (let i = 0; i < numComponents; i++) {
    // Generate random positions avoiding edges and overlap
    const x = 0.15 + Math.random() * 0.7;
    const y = 0.15 + Math.random() * 0.7;

    components.push({
      name: componentLabels[Math.floor(Math.random() * componentLabels.length)],
      x,
      y,
      w: 0.05 + Math.random() * 0.08,
      h: 0.05 + Math.random() * 0.08,
      confidence: 0.7 + Math.random() * 0.3,
    });
  }

  return components;
};

// For future: Connect to external ML API
export const detectComponentsFromAPI = async (
  imageFile: File,
  apiUrl: string
): Promise<DetectedComponent[]> => {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch(`${apiUrl}/api/detect`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Detection failed");
  }

  const data = await response.json();
  return data.components as DetectedComponent[];
};
