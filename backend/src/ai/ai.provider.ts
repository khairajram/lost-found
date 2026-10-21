import { AIVisualAnalysis } from '../types/index.js';

export interface AIProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  analyzeImage(imagePathOrBase64: string): Promise<AIVisualAnalysis | null>;
  compareVisuals(
    itemA: { description: string; visualFeatures?: string[] },
    itemB: { description: string; visualFeatures?: string[] }
  ): Promise<{ visualSimilarity: number; reasoning: string[] }>;
}
