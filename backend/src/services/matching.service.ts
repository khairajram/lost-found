import { prisma } from '../config/prisma.js';
import { calculateDistanceKm } from '../utils/geo.js';
import { geminiService } from '../ai/gemini.service.js';
import { notificationService } from './notification.service.js';
import { ENV } from '../config/env.js';
import { SimilarityBreakdown } from '../types/index.js';
import { LostItem, FoundItem, Match } from '@prisma/client';

export class MatchingService {
  /**
   * Calculate category similarity (0 - 100)
   */
  private calculateCategorySimilarity(catA: string, catB: string): number {
    if (catA.toLowerCase() === catB.toLowerCase()) return 100;
    // Related categories
    const phones = ['mobile phone', 'smartphone', 'phone'];
    if (phones.includes(catA.toLowerCase()) && phones.includes(catB.toLowerCase())) return 95;
    const electronics = ['laptop', 'tablet', 'camera', 'earphones'];
    if (electronics.includes(catA.toLowerCase()) && electronics.includes(catB.toLowerCase())) return 60;
    return 0;
  }

  /**
   * Calculate color similarity (0 - 100)
   */
  private calculateColorSimilarity(colorA: string, colorB: string): number {
    const a = colorA.toLowerCase();
    const b = colorB.toLowerCase();
    if (a === b) return 100;
    if (a.includes(b) || b.includes(a)) return 85;
    return 20;
  }

  /**
   * Calculate brand similarity (0 - 100)
   */
  private calculateBrandSimilarity(
    brandA?: string | null,
    modelA?: string | null,
    brandB?: string | null,
    modelB?: string | null
  ): number {
    if (!brandA && !brandB) return 70; // neutral if unspecified
    if (brandA && brandB && brandA.toLowerCase() === brandB.toLowerCase()) {
      if (
        modelA &&
        modelB &&
        (modelA.toLowerCase().includes(modelB.toLowerCase()) ||
          modelB.toLowerCase().includes(modelA.toLowerCase()))
      ) {
        return 95;
      }
      return 85;
    }
    return 10;
  }

  /**
   * Calculate location proximity similarity (0 - 100)
   */
  private calculateLocationSimilarity(
    locA: { latitude: number; longitude: number },
    locB: { latitude: number; longitude: number }
  ): { score: number; distanceKm: number } {
    const dist = calculateDistanceKm(locA.latitude, locA.longitude, locB.latitude, locB.longitude);
    let score = 100;
    if (dist <= 0.5) {
      score = 95; // Within 500m
    } else if (dist <= 1.5) {
      score = 85; // Within 1.5km
    } else if (dist <= 5) {
      score = 70;
    } else if (dist <= 15) {
      score = 50;
    } else {
      score = Math.max(0, 40 - Math.round(dist));
    }
    return { score, distanceKm: dist };
  }

  /**
   * Calculate date proximity similarity (0 - 100)
   */
  private calculateDateSimilarity(dateLost: Date, dateFound: Date): number {
    const diffHours = (dateFound.getTime() - dateLost.getTime()) / (1000 * 60 * 60);

    // Found within 48 hours after loss: ideal
    if (diffHours >= -2 && diffHours <= 48) {
      return 100;
    }
    if (diffHours > 48 && diffHours <= 168) {
      return 85; // within 1 week
    }
    if (diffHours > 168 && diffHours <= 720) {
      return 60; // within 1 month
    }
    if (diffHours < -2) {
      return 30; // found earlier than loss date
    }
    return 40;
  }

  /**
   * Calculate description & distinctive features overlap
   */
  private calculateDescriptionSimilarity(
    descA: string,
    featuresA: string[],
    descB: string,
    featuresB: string[]
  ): number {
    const textA = (descA + ' ' + featuresA.join(' ')).toLowerCase();
    const textB = (descB + ' ' + featuresB.join(' ')).toLowerCase();

    const wordsA = new Set(textA.split(/\s+/).filter((w) => w.length > 3));
    const wordsB = new Set(textB.split(/\s+/).filter((w) => w.length > 3));

    if (wordsA.size === 0 || wordsB.size === 0) return 60;

    let matches = 0;
    wordsA.forEach((w) => {
      if (wordsB.has(w)) matches++;
    });

    const unionSize = new Set([...wordsA, ...wordsB]).size;
    const jaccard = matches / unionSize;
    return Math.min(100, Math.round(jaccard * 180 + 30));
  }

  /**
   * Run matching pipeline when a new Lost Item is created.
   * Compares against all ACTIVE Found items.
   */
  async matchLostItem(lostItem: LostItem): Promise<Match[]> {
    console.log(`[Matching] Evaluating candidates for new lost item: ${lostItem.title} (${lostItem.id})`);

    const candidates = await prisma.foundItem.findMany({
      where: {
        status: 'ACTIVE',
        userId: { not: lostItem.userId },
      },
      take: 100,
    });

    const matchesCreated: Match[] = [];

    for (const found of candidates) {
      const match = await this.evaluatePair(lostItem, found);
      if (match) {
        matchesCreated.push(match);
      }
    }

    return matchesCreated;
  }

  /**
   * Run matching pipeline when a new Found Item is created (reverse matching).
   * Compares against all ACTIVE Lost items.
   */
  async matchFoundItem(foundItem: FoundItem): Promise<Match[]> {
    console.log(`[Matching] Evaluating candidates for new found item: ${foundItem.title} (${foundItem.id})`);

    const candidates = await prisma.lostItem.findMany({
      where: {
        status: 'ACTIVE',
        userId: { not: foundItem.userId },
      },
      take: 100,
    });

    const matchesCreated: Match[] = [];

    for (const lost of candidates) {
      const match = await this.evaluatePair(lost, foundItem);
      if (match) {
        matchesCreated.push(match);
      }
    }

    return matchesCreated;
  }

  /**
   * Evaluate a single LostItem + FoundItem pair with Gemini Multimodal AI.
   */
  private async evaluatePair(lost: LostItem, found: FoundItem): Promise<Match | null> {
    const categorySim = this.calculateCategorySimilarity(lost.category, found.category);
    // Hard filter: if categories are completely unrelated, skip expensive evaluation
    if (categorySim === 0 && lost.category !== 'Other' && found.category !== 'Other') {
      return null;
    }

    const colorSim = this.calculateColorSimilarity(lost.color, found.color);
    const brandSim = this.calculateBrandSimilarity(lost.brand, lost.model, found.brand, found.model);
    const { score: locSim, distanceKm } = this.calculateLocationSimilarity(
      { latitude: lost.latitude, longitude: lost.longitude },
      { latitude: found.latitude, longitude: found.longitude }
    );
    const dateSim = this.calculateDateSimilarity(lost.lostDate, found.foundDate);
    const descSim = this.calculateDescriptionSimilarity(
      lost.description,
      lost.distinctiveFeatures || [],
      found.description,
      found.distinctiveFeatures || []
    );

    // Call Gemini for direct multimodal visual comparison
    const geminiComparison = await geminiService.compareVisuals(
      {
        title: lost.title,
        description: lost.description,
        category: lost.category,
        images: lost.images,
        visualFeatures: lost.distinctiveFeatures,
      },
      {
        title: found.title,
        description: found.description,
        category: found.category,
        images: found.images,
        visualFeatures: found.distinctiveFeatures,
      }
    );

    const visualSim = geminiComparison.visualSimilarity;

    // Weighted Overall Score calculation
    // Weights: Visual 30%, Category 20%, Color 15%, Location 15%, Brand 10%, Date 5%, Description 5%
    const weightedScore = Math.round(
      visualSim * 0.30 +
      categorySim * 0.20 +
      colorSim * 0.15 +
      locSim * 0.15 +
      brandSim * 0.10 +
      dateSim * 0.05 +
      descSim * 0.05
    );

    if (weightedScore < ENV.MATCH_THRESHOLD) {
      return null;
    }

    const similarityBreakdown: SimilarityBreakdown = {
      visualSimilarity: visualSim,
      categorySimilarity: categorySim,
      colorSimilarity: colorSim,
      brandSimilarity: brandSim,
      locationSimilarity: locSim,
      dateSimilarity: dateSim,
      descriptionSimilarity: descSim,
    };

    // Combine Gemini's visual reasoning with distance and category explanation
    const combinedReasoning = [...geminiComparison.reasoning];
    if (distanceKm < 1) {
      combinedReasoning.push(`Found ${(distanceKm * 1000).toFixed(0)}m from reported lost location.`);
    } else {
      combinedReasoning.push(`Found approximately ${distanceKm.toFixed(1)} km from reported lost location.`);
    }

    // Upsert Match record in PostgreSQL
    const existing = await prisma.match.findFirst({
      where: {
        lostItemId: lost.id,
        foundItemId: found.id,
      },
    });

    let match: Match;
    if (existing) {
      match = await prisma.match.update({
        where: { id: existing.id },
        data: {
          matchScore: weightedScore,
          visualSimilarity: visualSim,
          categorySimilarity: categorySim,
          colorSimilarity: colorSim,
          brandSimilarity: brandSim,
          locationSimilarity: locSim,
          dateSimilarity: dateSim,
          descriptionSimilarity: descSim,
          aiReasoning: combinedReasoning,
        },
      });
    } else {
      match = await prisma.match.create({
        data: {
          lostItemId: lost.id,
          foundItemId: found.id,
          lostUserId: lost.userId,
          foundUserId: found.userId,
          matchScore: weightedScore,
          visualSimilarity: visualSim,
          categorySimilarity: categorySim,
          colorSimilarity: colorSim,
          brandSimilarity: brandSim,
          locationSimilarity: locSim,
          dateSimilarity: dateSim,
          descriptionSimilarity: descSim,
          aiReasoning: combinedReasoning,
          status: 'POTENTIAL',
        },
      });
    }

    console.log(`[Matching] Match computed: Score ${weightedScore}% between lost ${lost.id} and found ${found.id}`);

    // Trigger notification to both users
    await notificationService.notifyMatchFound(match as any, lost as any, found as any);

    return match;
  }
}

export const matchingService = new MatchingService();
