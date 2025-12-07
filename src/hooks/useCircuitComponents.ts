import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CircuitComponent {
  id: string;
  name: string;
  symbol: string | null;
  definition: string;
  application: string;
  why_used: string;
  image_url: string | null;
  created_at: string;
  category: string | null;
  circuit_diagram_svg: string | null;
  specifications: Record<string, string | string[]> | null;
  common_values: string[] | null;
}

export const useCircuitComponents = () => {
  return useQuery({
    queryKey: ["circuit-components"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("circuit_components")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as CircuitComponent[];
    },
  });
};

export const useCircuitComponent = (name: string) => {
  return useQuery({
    queryKey: ["circuit-component", name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("circuit_components")
        .select("*")
        .ilike("name", name)
        .maybeSingle();
      
      if (error) throw error;
      return data as CircuitComponent | null;
    },
    enabled: !!name,
  });
};
