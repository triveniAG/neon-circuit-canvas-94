import { DetectedComponent } from "@/types/detection";
import { supabase } from "@/integrations/supabase/client";

// Convert File to base64 string (without data URL prefix)
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const detectComponents = async (
  imageFile: File
): Promise<DetectedComponent[]> => {
  // Convert image to base64
  const imageBase64 = await fileToBase64(imageFile);

  // Call the edge function
  const { data, error } = await supabase.functions.invoke("detect-components", {
    body: { imageBase64 },
  });

  if (error) {
    console.error("Detection error:", error);
    throw new Error(error.message || "Component detection failed");
  }

  if (data?.error) {
    console.error("API error:", data.error);
    throw new Error(data.error);
  }

  return data?.components || [];
};
