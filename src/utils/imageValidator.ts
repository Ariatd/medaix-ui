/**
 * SMARTER Medical Image Validator - Two Phase System
 * Phase 1: Quick classification (preserves existing behavior for >=60%)
 * Phase 2: Deep validation for lower confidence cases
 */

export interface ValidationResult {
  isValid: boolean;
  message: string;
  detectedType?: string;
  confidence?: number;
  requiresConfirmation?: boolean;
  phase2Confidence?: number;
  warningType?: 'yellow' | 'red';
}

export const validateMedicalImage = async (file: File): Promise<ValidationResult> => {
  // Step 1: Basic file checks
  const validExtensions = ['.dcm', '.dicom', '.jpg', '.jpeg', '.png', '.tiff', '.tif'];
  const fileName = file.name.toLowerCase();
  
  if (!validExtensions.some(ext => fileName.endsWith(ext))) {
    return { isValid: false, message: 'Invalid file format. Please upload DICOM, JPG, PNG, or TIFF.' };
  }

  // DICOM files are always medical
  if (fileName.endsWith('.dcm') || fileName.endsWith('.dicom')) {
    return { isValid: true, message: 'DICOM medical file detected', detectedType: 'DICOM' };
  }

  // Step 2: Phase 1 - Quick Classification (Existing Logic Preserved)
  const phase1Result = await performPhase1Validation(file);
  
  // PHASE 1 DECISION - Keep existing behavior for >=60% EXACTLY
  if (phase1Result.confidence && phase1Result.confidence >= 60) {
    return {
      isValid: true,
      message: phase1Result.message,
      detectedType: phase1Result.detectedType,
      confidence: phase1Result.confidence,
      requiresConfirmation: phase1Result.requiresConfirmation
    };
  }

  // PHASE 1 DECISION - Mid confidence (50-60%): YELLOW warning
  if (phase1Result.confidence && phase1Result.confidence >= 50 && phase1Result.confidence < 60) {
    return {
      isValid: true,
      message: 'We are not fully confident this is a medical image, please verify.',
      detectedType: phase1Result.detectedType,
      confidence: phase1Result.confidence,
      warningType: 'yellow'
    };
  }

  // PHASE 1 DECISION - Low confidence (<50%): Start Phase 2
  if (phase1Result.confidence && phase1Result.confidence < 50) {
    const phase2Result = await performPhase2DeepValidation(file);
    
    // PHASE 2 DECISION
    if (phase2Result.phase2Confidence && phase2Result.phase2Confidence >= 65) {
      // Phase 2 success: RED warning
      return {
        isValid: true,
        message: 'Warning: This image may be medical, but uncertainty remains. Please be cautious when interpreting results.',
        detectedType: phase1Result.detectedType,
        confidence: phase1Result.confidence,
        phase2Confidence: phase2Result.phase2Confidence,
        warningType: 'red'
      };
    } else {
      // Phase 2 failure: Reject
      return {
        isValid: false,
        message: 'Only medical imaging files are accepted (X-ray, MRI, CT, Ultrasound). This image does not appear to contain human anatomy.',
        confidence: phase1Result.confidence
      };
    }
  }

  // Fallback for cases without confidence
  return {
    isValid: false,
    message: 'Unable to validate image. Please try a different file.',
    confidence: 0
  };
};

// PHASE 1: Quick Classification (Existing Logic Preserved)
const performPhase1Validation = async (file: File): Promise<ValidationResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to analyze pixels
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData?.data;
        
        if (!pixels) {
          resolve({ isValid: false, message: 'Could not analyze image', confidence: 0 });
          return;
        }

        // Analyze image characteristics (EXISTING LOGIC)
        let grayscalePixels = 0;
        let totalPixels = pixels.length / 4;
        let darkPixels = 0;
        let highContrastCount = 0;
        
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          
          // Check if grayscale (R ≈ G ≈ B)
          if (Math.abs(r - g) < 10 && Math.abs(g - b) < 10 && Math.abs(r - b) < 10) {
            grayscalePixels++;
          }
          
          // Check if dark (common in X-rays, MRIs)
          const brightness = (r + g + b) / 3;
          if (brightness < 60) darkPixels++;
          
          // Check contrast
          if (brightness < 30 || brightness > 225) highContrastCount++;
        }

        const grayscaleRatio = grayscalePixels / totalPixels;
        const darkRatio = darkPixels / totalPixels;
        const contrastRatio = highContrastCount / totalPixels;
        
        // Dimension check - medical images are usually high-res
        if (img.width < 256 || img.height < 256) {
          resolve({ 
            isValid: false, 
            message: 'Image too small. Medical images should be at least 256x256 pixels.',
            confidence: 0
          });
          return;
        }

        // LESS AGGRESSIVE validation - accept images that LOOK LIKE medical images
        const detectsHumanAnatomy = (imageData: ImageData): boolean => {
          // X-rays have specific patterns:
          // 1. Very high contrast (bones are almost white, background almost black)
          // 2. Bone structures have specific brightness patterns
          // 3. Typical aspect ratios for medical imaging
          
          const pixels = imageData.data;
          let veryBrightPixels = 0; // bones (>200 brightness)
          let veryDarkPixels = 0;   // background (<30 brightness)
          let midTonePixels = 0;    // soft tissue (100-180 brightness)
          
          for (let i = 0; i < pixels.length; i += 4) {
            const brightness = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3;
            if (brightness > 200) veryBrightPixels++;
            else if (brightness < 30) veryDarkPixels++;
            else if (brightness > 100 && brightness < 180) midTonePixels++;
          }
          
          const totalPixels = pixels.length / 4;
          const brightRatio = veryBrightPixels / totalPixels;
          const darkRatio = veryDarkPixels / totalPixels;
          const midRatio = midTonePixels / totalPixels;
          
          // LENIENT X-ray pattern: lower thresholds for approximate medical images
          const isXrayPattern = (
            darkRatio > 0.15 &&           // Reduced from 0.3 to 0.15 (15% dark background)
            brightRatio > 0.02 &&         // Reduced from 0.05 to 0.02 (2% bright pixels)
            brightRatio < 0.4 &&          // Not too much bright (not overexposed)
            (brightRatio + darkRatio) > 0.3  // Reduced from 0.5 to 0.3 (30% combined contrast)
          );
          
          return isXrayPattern;
        };

        // Medical image detection rules - LENIENT VERSION:
        // Accept images that LOOK LIKE medical images
        const hasPossibleMedicalPattern = (
          grayscaleRatio > 0.6 && detectsHumanAnatomy(imageData) // Reduced threshold from 0.85 to 0.6
        );
        
        const hasHighContrastMedicalPattern = (
          grayscaleRatio > 0.7 && contrastRatio > 0.15 && darkRatio > 0.15 // More lenient thresholds
        );
        
        const isDefinitelyNotMedical = (
          grayscaleRatio < 0.2 || // Very colorful images
          (grayscaleRatio > 0.8 && !detectsHumanAnatomy(imageData) && contrastRatio < 0.1) // Grayscale but clearly not medical
        );

        if (isDefinitelyNotMedical) {
          resolve({
            isValid: false,
            message: 'This image does not appear to contain human anatomy. Please upload an X-ray, MRI, CT, or Ultrasound.',
            confidence: 20,
            requiresConfirmation: false
          });
          return;
        }

        // Check if image has any medical-like patterns
        const isLikelyMedical = hasPossibleMedicalPattern || hasHighContrastMedicalPattern;
        
        if (isLikelyMedical) {
          // Determine type based on characteristics
          let detectedType = 'Medical Scan';
          let confidence = Math.round(grayscaleRatio * 100);
          
          if (grayscaleRatio > 0.8 && darkRatio > 0.2) {
            detectedType = 'X-ray';
            confidence = Math.max(confidence, 75);
          } else if (grayscaleRatio > 0.7 && contrastRatio > 0.1) {
            detectedType = 'MRI/CT Scan';
            confidence = Math.max(confidence, 70);
          } else if (grayscaleRatio > 0.6) {
            detectedType = 'Ultrasound';
            confidence = Math.max(confidence, 60);
          }
          
          // Check if it's a weak medical pattern
          const isWeakPattern = (
            (grayscaleRatio > 0.6 && grayscaleRatio < 0.8) ||
            (hasPossibleMedicalPattern && confidence < 70)
          );
          
          if (isWeakPattern) {
            resolve({
              isValid: true,
              message: `${detectedType} detected (low confidence anatomy detection)`,
              detectedType,
              confidence,
              requiresConfirmation: true
            });
          } else {
            resolve({
              isValid: true,
              message: `${detectedType} detected`,
              detectedType,
              confidence
            });
          }

        } else {
          // Not medical enough but don't reject - allow with warning
          resolve({
            isValid: true,
            message: 'Possible medical image detected - low confidence',
            detectedType: 'Unknown',
            confidence: Math.round(grayscaleRatio * 50), // Lower confidence
            requiresConfirmation: true
          });
        }
      };
      
      img.onerror = () => resolve({ isValid: false, message: 'Invalid image file', confidence: 0 });
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

// PHASE 2: Deep Analysis for Low Confidence Cases
const performPhase2DeepValidation = async (file: File): Promise<{ phase2Confidence: number }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData?.data;
        
        if (!pixels) {
          resolve({ phase2Confidence: 0 });
          return;
        }

        // PHASE 2: Advanced anatomical pattern detection
        const confidence = analyzeAdvancedMedicalPatterns(imageData, img.width, img.height);
        resolve({ phase2Confidence: confidence });
      };
      
      img.onerror = () => resolve({ phase2Confidence: 0 });
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

// Advanced medical pattern analysis for Phase 2
const analyzeAdvancedMedicalPatterns = (imageData: ImageData, width: number, height: number): number => {
  const pixels = imageData.data;
  const totalPixels = pixels.length / 4;
  
  // Pattern detection scores
  let anatomicalPatternScore = 0;
  let medicalArtifactScore = 0;
  let rejectionScore = 0;
  
  // 1. Detect text/icons (rejection patterns)
  const textIconScore = detectTextIcons(pixels, width, height);
  rejectionScore += textIconScore * 30; // High penalty for text/icons
  
  // 2. Detect screenshots/graphics (rejection patterns)
  const screenshotScore = detectScreenshots(pixels, width, height);
  rejectionScore += screenshotScore * 25; // Penalty for screenshots
  
  // 3. Detect uniform brightness (rejection patterns)
  const uniformScore = detectUniformBrightness(pixels);
  rejectionScore += uniformScore * 20; // Penalty for uniform images
  
  // 4. Bone structure patterns (positive for X-ray)
  const boneScore = detectBoneStructures(pixels, width, height);
  anatomicalPatternScore += boneScore * 25;
  
  // 5. Cross-sectional patterns (positive for CT/MRI)
  const crossSectionScore = detectCrossSectionalPatterns(pixels, width, height);
  anatomicalPatternScore += crossSectionScore * 20;
  
  // 6. Ultrasound grain patterns (positive for ultrasound)
  const ultrasoundScore = detectUltrasoundPatterns(pixels, width, height);
  anatomicalPatternScore += ultrasoundScore * 15;
  
  // 7. Medical imaging artifacts (positive indicators)
  const artifactScore = detectMedicalArtifacts(pixels, width, height);
  medicalArtifactScore += artifactScore * 20;
  
  // 8. Soft tissue gradient consistency (positive)
  const gradientScore = detectSoftTissueGradients(pixels, width, height);
  anatomicalPatternScore += gradientScore * 15;
  
  // Calculate final confidence
  const positiveScore = anatomicalPatternScore + medicalArtifactScore;
  const finalScore = Math.max(0, positiveScore - rejectionScore);
  
  return Math.min(100, Math.round(finalScore));
};

// Helper functions for Phase 2 detection

const detectTextIcons = (pixels: Uint8ClampedArray, width: number, height: number): number => {
  // Look for high contrast edges that suggest text or icons
  let highContrastEdges = 0;
  const threshold = 100; // Significant brightness difference
  
  for (let y = 1; y < height - 1; y += 2) {
    for (let x = 1; x < width - 1; x += 2) {
      const idx = (y * width + x) * 4;
      const idxRight = (y * width + x + 1) * 4;
      const idxDown = ((y + 1) * width + x) * 4;
      
      const brightness = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
      const rightBrightness = (pixels[idxRight] + pixels[idxRight + 1] + pixels[idxRight + 2]) / 3;
      const downBrightness = (pixels[idxDown] + pixels[idxDown + 1] + pixels[idxDown + 2]) / 3;
      
      if (Math.abs(brightness - rightBrightness) > threshold || 
          Math.abs(brightness - downBrightness) > threshold) {
        highContrastEdges++;
      }
    }
  }
  
  return Math.min(1, highContrastEdges / (width * height * 0.01));
};

const detectScreenshots = (pixels: Uint8ClampedArray, width: number, height: number): number => {
  // Screenshots often have uniform areas and UI elements
  let uiElements = 0;
  
  // Check for large uniform areas (typical of screenshots)
  const sampleSize = 8;
  for (let y = 0; y < height - sampleSize; y += sampleSize) {
    for (let x = 0; x < width - sampleSize; x += sampleSize) {
      let variance = 0;
      let totalBrightness = 0;
      
      for (let dy = 0; dy < sampleSize; dy++) {
        for (let dx = 0; dx < sampleSize; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          const brightness = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
          totalBrightness += brightness;
        }
      }
      
      const avgBrightness = totalBrightness / (sampleSize * sampleSize);
      
      // Check variance in this block
      for (let dy = 0; dy < sampleSize; dy++) {
        for (let dx = 0; dx < sampleSize; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          const brightness = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
          variance += Math.abs(brightness - avgBrightness);
        }
      }
      
      variance /= (sampleSize * sampleSize);
      if (variance < 5) uiElements++; // Very uniform area
    }
  }
  
  return Math.min(1, uiElements / (width * height / (sampleSize * sampleSize * 100)));
};

const detectUniformBrightness = (pixels: Uint8ClampedArray): number => {
  // Check if the entire image has very uniform brightness
  let totalBrightness = 0;
  let brightnessValues: number[] = [];
  
  for (let i = 0; i < pixels.length; i += 16) { // Sample every 4th pixel
    const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    totalBrightness += brightness;
    brightnessValues.push(brightness);
  }
  
  const avgBrightness = totalBrightness / brightnessValues.length;
  
  // Calculate variance
  let variance = 0;
  for (const brightness of brightnessValues) {
    variance += Math.pow(brightness - avgBrightness, 2);
  }
  variance /= brightnessValues.length;
  
  // Very low variance suggests uniform/non-medical image
  return variance < 100 ? 1 : 0;
};

const detectBoneStructures = (pixels: Uint8ClampedArray, width: number, height: number): number => {
  // Look for bone-like structures (very bright areas with specific patterns)
  let bonePixels = 0;
  let skullLikePatterns = 0;
  
  for (let i = 0; i < pixels.length; i += 4) {
    const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    
    // Bone pixels are very bright
    if (brightness > 200) {
      bonePixels++;
    }
  }
  
  const boneRatio = bonePixels / (pixels.length / 4);
  
  // Additional patterns that suggest skull/rib cage
  if (boneRatio > 0.02 && boneRatio < 0.3) {
    skullLikePatterns = 1;
  }
  
  return Math.min(1, boneRatio * 5 + skullLikePatterns);
};

const detectCrossSectionalPatterns = (pixels: Uint8ClampedArray, width: number, height: number): number => {
  // Look for CT/MRI cross-sectional patterns
  let softTissueGradients = 0;
  
  // Sample horizontal and vertical lines for gradient patterns
  for (let y = 0; y < height; y += 10) {
    let gradientCount = 0;
    for (let x = 1; x < width; x += 5) {
      const idx1 = (y * width + x - 1) * 4;
      const idx2 = (y * width + x) * 4;
      
      const brightness1 = (pixels[idx1] + pixels[idx1 + 1] + pixels[idx1 + 2]) / 3;
      const brightness2 = (pixels[idx2] + pixels[idx2 + 1] + pixels[idx2 + 2]) / 3;
      
      if (Math.abs(brightness1 - brightness2) > 20 && 
          brightness1 > 50 && brightness1 < 180 &&
          brightness2 > 50 && brightness2 < 180) {
        gradientCount++;
      }
    }
    if (gradientCount > width * 0.1) softTissueGradients++;
  }
  
  return Math.min(1, softTissueGradients / (height / 10));
};

const detectUltrasoundPatterns = (pixels: Uint8ClampedArray, width: number, height: number): number => {
  // Look for characteristic ultrasound grain/noise patterns
  let grainyPixels = 0;
  let totalChecked = 0;
  
  for (let y = 1; y < height - 1; y += 3) {
    for (let x = 1; x < width - 1; x += 3) {
      const idx = (y * width + x) * 4;
      const idxRight = (y * width + x + 1) * 4;
      const idxDown = ((y + 1) * width + x) * 4;
      
      const brightness = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
      const rightBrightness = (pixels[idxRight] + pixels[idxRight + 1] + pixels[idxRight + 2]) / 3;
      const downBrightness = (pixels[idxDown] + pixels[idxDown + 1] + pixels[idxDown + 2]) / 3;
      
      // Ultrasound has characteristic grainy texture
      const variation = Math.abs(brightness - rightBrightness) + Math.abs(brightness - downBrightness);
      if (variation > 15 && variation < 50) {
        grainyPixels++;
      }
      totalChecked++;
    }
  }
  
  const grainRatio = grainyPixels / totalChecked;
  return Math.min(1, grainRatio * 3);
};

const detectMedicalArtifacts = (pixels: Uint8ClampedArray, width: number, height: number): number => {
  // Look for medical imaging artifacts (grid patterns, measurement marks, etc.)
  let artifactScore = 0;
  
  // Check for regular grid patterns (common in medical imaging)
  let horizontalLines = 0;
  let verticalLines = 0;
  
  // Sample horizontal lines
  for (let y = 0; y < height; y += 20) {
    let lineBrightness: number[] = [];
    for (let x = 0; x < width; x += 2) {
      const idx = (y * width + x) * 4;
      const brightness = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
      lineBrightness.push(brightness);
    }
    
    // Check if this line has a consistent pattern
    const variance = calculateVariance(lineBrightness);
    if (variance < 20) horizontalLines++;
  }
  
  // Sample vertical lines
  for (let x = 0; x < width; x += 20) {
    let lineBrightness: number[] = [];
    for (let y = 0; y < height; y += 2) {
      const idx = (y * width + x) * 4;
      const brightness = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
      lineBrightness.push(brightness);
    }
    
    const variance = calculateVariance(lineBrightness);
    if (variance < 20) verticalLines++;
  }
  
  if (horizontalLines > 2 || verticalLines > 2) {
    artifactScore = 0.5; // Regular patterns suggest medical imaging
  }
  
  return artifactScore;
};

const detectSoftTissueGradients = (pixels: Uint8ClampedArray, width: number, height: number): number => {
  // Look for soft tissue gradient consistency (typical in medical imaging)
  let gradientRegions = 0;
  
  // Check multiple regions for smooth gradients
  const regionSize = Math.min(50, Math.floor(Math.min(width, height) / 4));
  
  for (let regionY = 0; regionY < height - regionSize; regionY += regionSize) {
    for (let regionX = 0; regionX < width - regionSize; regionX += regionSize) {
      let regionGradients = 0;
      
      // Sample this region for gradient patterns
      for (let y = regionY + 5; y < regionY + regionSize - 5; y += 5) {
        for (let x = regionX + 5; x < regionX + regionSize - 5; x += 5) {
          const idx = (y * width + x) * 4;
          const brightness = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
          
          // Check surrounding pixels for gradual changes
          let similarNeighbors = 0;
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              if (dx === 0 && dy === 0) continue;
              const neighborIdx = ((y + dy) * width + (x + dx)) * 4;
              if (neighborIdx >= 0 && neighborIdx < pixels.length) {
                const neighborBrightness = (pixels[neighborIdx] + pixels[neighborIdx + 1] + pixels[neighborIdx + 2]) / 3;
                if (Math.abs(brightness - neighborBrightness) < 30) {
                  similarNeighbors++;
                }
              }
            }
          }
          
          if (similarNeighbors > 15) regionGradients++;
        }
      }
      
      if (regionGradients > 20) gradientRegions++;
    }
  }
  
  return Math.min(1, gradientRegions / 4);
};

const calculateVariance = (values: number[]): number => {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return variance;
};

// Export the new function as the default validator for compatibility
export const validateImageFile = validateMedicalImage;
