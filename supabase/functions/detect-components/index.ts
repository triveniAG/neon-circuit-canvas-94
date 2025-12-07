import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DetectedComponent {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  confidence: number;
}

// Map Google Vision labels to electronic components
const componentMapping: Record<string, string> = {
  "resistor": "Resistor",
  "capacitor": "Capacitor",
  "transistor": "Transistor",
  "diode": "Diode",
  "led": "LED",
  "inductor": "Inductor",
  "integrated circuit": "Integrated Circuit",
  "ic": "Integrated Circuit",
  "chip": "Integrated Circuit",
  "transformer": "Transformer",
  "relay": "Relay",
  "fuse": "Fuse",
  "switch": "Switch",
  "button": "Button",
  "connector": "Connector",
  "battery": "Battery",
  "motor": "Motor",
  "speaker": "Speaker",
  "microphone": "Microphone",
  "sensor": "Sensor",
  "crystal": "Crystal Oscillator",
  "oscillator": "Crystal Oscillator",
  "voltage regulator": "Voltage Regulator",
  "potentiometer": "Potentiometer",
  "electronic component": "Electronic Component",
  "circuit board": "Circuit Board",
  "pcb": "Circuit Board",
  "printed circuit board": "Circuit Board",
};

function matchComponentLabel(label: string): string | null {
  const lowerLabel = label.toLowerCase();
  
  for (const [key, value] of Object.entries(componentMapping)) {
    if (lowerLabel.includes(key)) {
      return value;
    }
  }
  
  return null;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image data provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("GOOGLE_CLOUD_VISION_API_KEY");
    if (!apiKey) {
      console.error("GOOGLE_CLOUD_VISION_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Vision API not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Calling Google Cloud Vision API...");

    // Call Google Cloud Vision API
    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { content: imageBase64 },
              features: [
                { type: "OBJECT_LOCALIZATION", maxResults: 20 },
                { type: "LABEL_DETECTION", maxResults: 20 },
              ],
            },
          ],
        }),
      }
    );

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      console.error("Vision API error:", visionResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Vision API request failed", details: errorText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const visionData = await visionResponse.json();
    console.log("Vision API response received");

    const components: DetectedComponent[] = [];
    const response = visionData.responses?.[0];

    // Process object localization results
    if (response?.localizedObjectAnnotations) {
      for (const obj of response.localizedObjectAnnotations) {
        const componentName = matchComponentLabel(obj.name);
        if (componentName) {
          const vertices = obj.boundingPoly?.normalizedVertices || [];
          if (vertices.length >= 4) {
            const x = vertices[0]?.x || 0;
            const y = vertices[0]?.y || 0;
            const w = (vertices[2]?.x || 0) - x;
            const h = (vertices[2]?.y || 0) - y;
            
            components.push({
              name: componentName,
              x: x + w / 2, // center x
              y: y + h / 2, // center y
              w,
              h,
              confidence: obj.score || 0.8,
            });
          }
        }
      }
    }

    // If no objects found, use label detection as fallback
    if (components.length === 0 && response?.labelAnnotations) {
      console.log("No localized objects, using label detection fallback");
      
      const electronicsLabels = response.labelAnnotations
        .filter((label: any) => matchComponentLabel(label.description))
        .slice(0, 6);

      // Generate approximate positions for detected labels
      for (let i = 0; i < electronicsLabels.length; i++) {
        const label = electronicsLabels[i];
        const componentName = matchComponentLabel(label.description);
        if (componentName) {
          // Distribute components across the image
          const row = Math.floor(i / 3);
          const col = i % 3;
          
          components.push({
            name: componentName,
            x: 0.2 + col * 0.3,
            y: 0.25 + row * 0.4,
            w: 0.1,
            h: 0.1,
            confidence: label.score || 0.7,
          });
        }
      }
    }

    console.log(`Detected ${components.length} electronic components`);

    return new Response(
      JSON.stringify({ components }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Detection error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Detection failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
