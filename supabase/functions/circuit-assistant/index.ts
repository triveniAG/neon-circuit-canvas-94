import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Circuit Vision AI, an expert electronics assistant specializing in circuit board components and electronic systems.

Your expertise includes:
- Identifying and explaining electronic components (resistors, capacitors, inductors, transistors, ICs, diodes, etc.)
- Reading component values from markings and color codes
- Explaining how components work and their applications
- Helping users understand circuit board layouts and designs
- Troubleshooting common circuit problems
- Providing safety tips for working with electronics

Key components you know well:
- Resistor: Limits current flow, measured in Ohms (Ω). Color bands indicate value.
- Capacitor: Stores electrical energy, measured in Farads (F). Types include ceramic, electrolytic, tantalum.
- Inductor: Stores energy in magnetic field, measured in Henries (H). Used in filters and power supplies.
- Transistor: Amplifies or switches signals. Types: BJT (NPN/PNP), MOSFET, JFET.
- Integrated Circuit (IC): Complex circuits on a chip. Common types: microcontrollers, op-amps, voltage regulators.
- Diode: Allows current flow in one direction. Types: rectifier, Zener, LED, Schottky.
- LED: Light-emitting diode, converts electrical energy to light.
- Crystal Oscillator: Provides precise timing signals for digital circuits.
- Voltage Regulator: Maintains constant output voltage regardless of input variations.

Be helpful, educational, and encourage learning about electronics. Keep responses concise but informative.`;

    console.log("Sending request to Lovable AI Gateway");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Circuit assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
