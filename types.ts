
export type ImageSize = '1K'; // gemini-2.5-flash-image uses default sizing

export interface LogoGenerationResult {
  imageUrl: string;
  base64: string;
  prompt: string;
}

export type MotionPreset = 'reveal' | 'float' | 'pulse';

export enum AppStep {
  DesignInput = 'design-input',
  LogoGenerating = 'logo-generating',
  LogoResult = 'logo-result'
}
