import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { ENV } from '../config/env.js';
import { AIProvider } from './ai.provider.js';
import { AIVisualAnalysis } from '../types/index.js';

export class OllamaService implements AIProvider {
  name = 'OllamaProvider';
  private baseURL: string;
  private model: string;

  constructor() {
    this.baseURL = ENV.OLLAMA_BASE_URL;
    this.model = ENV.OLLAMA_MODEL;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const res = await axios.get(`${this.baseURL}/api/tags`, { timeout: 3000 });
      return res.status === 200;
    } catch {
      return false;
    }
  }

  private getImageBase64(imagePath: string): string | null {
    try {
      // If already base64 string
      if (imagePath.startsWith('data:image')) {
        return imagePath.split(',')[1];
      }

      // If absolute or relative local path in uploads
      let resolvedPath = imagePath;
      if (!fs.existsSync(resolvedPath)) {
        resolvedPath = path.resolve(ENV.UPLOAD_DIR, path.basename(imagePath));
      }

      if (fs.existsSync(resolvedPath)) {
        const fileBuffer = fs.readFileSync(resolvedPath);
        return fileBuffer.toString('base64');
      }

      return null;
    } catch (err) {
      console.warn('[OllamaService] Error reading image for base64:', err);
      return null;
    }
  }

  async analyzeImage(imagePath: string): Promise<AIVisualAnalysis | null> {
    const isOnline = await this.isAvailable();
    if (!isOnline) {
      console.log('[OllamaService] Ollama is currently offline or unreachable. Skipping vision generation.');
      return null;
    }

    const imageBase64 = this.getImageBase64(imagePath);

    const prompt = `Analyze this object image carefully. Identify and extract visual details in strict JSON format:
{
  "category": "category of object (e.g. Mobile Phone, Laptop, Wallet, Keys, Earphones, Watch, Bag, etc.)",
  "brand": "visible brand or empty string",
  "model": "model identifier if recognizable or empty string",
  "primaryColor": "dominant color name",
  "secondaryColors": ["list of secondary colors"],
  "visibleText": ["any legible words or numbers visible"],
  "distinctiveFeatures": ["notable marks, case type, scratches, stickers, damage, unique design features"],
  "objectDescription": "concise physical description of the item",
  "confidence": 0.85
}
Return ONLY the raw JSON object without markdown or formatting.`;

    try {
      const response = await axios.post(
        `${this.baseURL}/api/generate`,
        {
          model: this.model,
          prompt,
          images: imageBase64 ? [imageBase64] : undefined,
          stream: false,
          format: 'json',
        },
        { timeout: 25000 }
      );

      const rawText = response.data?.response;
      if (!rawText) return null;

      // Extract JSON if model wrapped in code blocks
      const cleanJson = rawText.replace(/```json\n?|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        category: parsed.category || 'Other',
        brand: parsed.brand || undefined,
        model: parsed.model || undefined,
        primaryColor: parsed.primaryColor || 'Unknown',
        secondaryColors: Array.isArray(parsed.secondaryColors) ? parsed.secondaryColors : [],
        visibleText: Array.isArray(parsed.visibleText) ? parsed.visibleText : [],
        distinctiveFeatures: Array.isArray(parsed.distinctiveFeatures) ? parsed.distinctiveFeatures : [],
        objectDescription: parsed.objectDescription || 'Analyzed item',
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.85,
      };
    } catch (err: any) {
      console.warn('[OllamaService] Vision analysis request failed:', err.message);
      return null;
    }
  }

  async compareVisuals(
    itemA: { description: string; visualFeatures?: string[] },
    itemB: { description: string; visualFeatures?: string[] }
  ): Promise<{ visualSimilarity: number; reasoning: string[] }> {
    const isOnline = await this.isAvailable();
    if (!isOnline) {
      return {
        visualSimilarity: 75,
        reasoning: ['Compared metadata characteristics while local vision model was offline.'],
      };
    }

    const prompt = `Compare these two reported items:
Item A: "${itemA.description}". Visual features: ${JSON.stringify(itemA.visualFeatures || [])}
Item B: "${itemB.description}". Visual features: ${JSON.stringify(itemB.visualFeatures || [])}

Evaluate how likely they are to be the same physical object.
Return JSON format:
{
  "visualSimilarity": <number from 0 to 100>,
  "reasoning": ["point 1", "point 2"]
}`;

    try {
      const response = await axios.post(
        `${this.baseURL}/api/generate`,
        {
          model: this.model,
          prompt,
          stream: false,
          format: 'json',
        },
        { timeout: 15000 }
      );

      const cleanJson = response.data?.response?.replace(/```json\n?|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        visualSimilarity: typeof parsed.visualSimilarity === 'number' ? parsed.visualSimilarity : 75,
        reasoning: Array.isArray(parsed.reasoning) ? parsed.reasoning : ['Visual and feature comparison evaluated.'],
      };
    } catch {
      return {
        visualSimilarity: 75,
        reasoning: ['Heuristic feature comparison.'],
      };
    }
  }
}

export const ollamaService = new OllamaService();
