import { Request } from 'express';

export interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
  state?: string;
  country?: string;
  approximateArea: string;
}

export interface AuthenticatedUser {
  _id: string;
  id?: string;
  email: string;
  name: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export interface AIVisualAnalysis {
  category: string;
  brand?: string;
  model?: string;
  primaryColor: string;
  secondaryColors?: string[];
  visibleText?: string[];
  distinctiveFeatures?: string[];
  objectDescription: string;
  confidence: number;
}

export interface SimilarityBreakdown {
  visualSimilarity: number;
  categorySimilarity: number;
  colorSimilarity: number;
  brandSimilarity: number;
  locationSimilarity: number;
  dateSimilarity: number;
  descriptionSimilarity: number;
}
