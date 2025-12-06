export interface DetectedComponent {
  name: string;
  x: number; // normalized 0-1
  y: number; // normalized 0-1
  w: number; // normalized width
  h: number; // normalized height
  confidence?: number;
}

export interface ScanResult {
  id: string;
  image_url: string | null;
  detected_components: DetectedComponent[];
  created_at: string;
}
