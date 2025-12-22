// OpenCV.js Circuit Board Detection Utility
import cv from '@techstark/opencv-js';

export interface DetectedBoard {
  x: number;
  y: number;
  width: number;
  height: number;
  contour: number[][];
  confidence: number;
}

let isOpenCVReady = false;

// Initialize OpenCV
export const initOpenCV = (): Promise<void> => {
  return new Promise((resolve) => {
    if (isOpenCVReady) {
      resolve();
      return;
    }

    // Check if cv.Mat exists (OpenCV is ready)
    const checkReady = () => {
      if (cv && cv.Mat) {
        isOpenCVReady = true;
        console.log('OpenCV.js initialized successfully');
        resolve();
      } else {
        setTimeout(checkReady, 50);
      }
    };

    checkReady();
  });
};

// Detect rectangular circuit boards using contour analysis
export const detectCircuitBoard = async (
  videoElement: HTMLVideoElement
): Promise<DetectedBoard | null> => {
  await initOpenCV();

  const width = videoElement.videoWidth;
  const height = videoElement.videoHeight;

  if (width === 0 || height === 0) {
    console.warn('Video dimensions are 0');
    return null;
  }

  // Create canvas and capture frame
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.drawImage(videoElement, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);

  // Create OpenCV Mat from image data
  const src = cv.matFromImageData(imageData);
  const gray = new cv.Mat();
  const blurred = new cv.Mat();
  const edges = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  try {
    // Convert to grayscale
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    // Apply Gaussian blur to reduce noise
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

    // Apply Canny edge detection
    cv.Canny(blurred, edges, 50, 150);

    // Dilate edges to close gaps
    const kernel = cv.Mat.ones(3, 3, cv.CV_8U);
    cv.dilate(edges, edges, kernel);
    kernel.delete();

    // Find contours
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let bestContour: DetectedBoard | null = null;
    let maxArea = 0;
    const minAreaThreshold = (width * height) * 0.05; // At least 5% of frame
    const maxAreaThreshold = (width * height) * 0.95; // At most 95% of frame

    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i);
      const area = cv.contourArea(contour);

      // Filter by area
      if (area < minAreaThreshold || area > maxAreaThreshold) {
        contour.delete();
        continue;
      }

      // Approximate contour to reduce points
      const epsilon = 0.02 * cv.arcLength(contour, true);
      const approx = new cv.Mat();
      cv.approxPolyDP(contour, approx, epsilon, true);

      // Look for quadrilaterals (4 sides) - typical for circuit boards
      const numVertices = approx.rows;
      
      if (numVertices >= 4 && numVertices <= 8) {
        // Check if it's roughly rectangular
        const rect = cv.boundingRect(contour);
        const aspectRatio = rect.width / rect.height;
        
        // Circuit boards typically have aspect ratio between 0.5 and 2
        if (aspectRatio >= 0.3 && aspectRatio <= 3.5) {
          // Calculate rectangularity (how rectangular the shape is)
          const rectArea = rect.width * rect.height;
          const rectangularity = area / rectArea;

          // Good rectangles have rectangularity > 0.7
          if (rectangularity > 0.6 && area > maxArea) {
            maxArea = area;

            // Extract contour points for polygon rendering
            const contourPoints: number[][] = [];
            for (let j = 0; j < approx.rows; j++) {
              contourPoints.push([
                approx.data32S[j * 2],
                approx.data32S[j * 2 + 1]
              ]);
            }

            // Scale coordinates to video display size
            const scaleX = videoElement.clientWidth / width;
            const scaleY = videoElement.clientHeight / height;

            bestContour = {
              x: rect.x * scaleX,
              y: rect.y * scaleY,
              width: rect.width * scaleX,
              height: rect.height * scaleY,
              contour: contourPoints.map(([px, py]) => [px * scaleX, py * scaleY]),
              confidence: Math.min(rectangularity * 1.2, 1), // Scale confidence
            };
          }
        }
      }

      approx.delete();
      contour.delete();
    }

    return bestContour;
  } catch (error) {
    console.error('OpenCV detection error:', error);
    return null;
  } finally {
    // Clean up OpenCV Mats
    src.delete();
    gray.delete();
    blurred.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();
  }
};

// Get edge detection visualization for AR overlay
export const getEdgeVisualization = async (
  videoElement: HTMLVideoElement
): Promise<ImageData | null> => {
  await initOpenCV();

  const width = videoElement.videoWidth;
  const height = videoElement.videoHeight;

  if (width === 0 || height === 0) return null;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.drawImage(videoElement, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);

  const src = cv.matFromImageData(imageData);
  const gray = new cv.Mat();
  const edges = new cv.Mat();

  try {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.Canny(gray, edges, 50, 150);
    
    // Convert edges to RGBA for display
    const edgesRGBA = new cv.Mat();
    cv.cvtColor(edges, edgesRGBA, cv.COLOR_GRAY2RGBA);
    
    // Create output ImageData
    const outputData = new ImageData(
      new Uint8ClampedArray(edgesRGBA.data),
      width,
      height
    );

    edgesRGBA.delete();
    return outputData;
  } catch (error) {
    console.error('Edge visualization error:', error);
    return null;
  } finally {
    src.delete();
    gray.delete();
    edges.delete();
  }
};

// Check if OpenCV is loaded
export const isOpenCVLoaded = (): boolean => isOpenCVReady;
