import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../types/index.js';
import { matchingService } from '../services/matching.service.js';
import { geminiService } from '../ai/gemini.service.js';

export const createFoundItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      title,
      description,
      category,
      brand,
      model,
      color,
      distinctiveFeatures = [],
      foundDate,
      foundLocation,
      images = [],
    } = req.body;

    const foundItem = await prisma.foundItem.create({
      data: {
        userId,
        title,
        description,
        category,
        brand: brand || null,
        model: model || null,
        color,
        distinctiveFeatures: Array.isArray(distinctiveFeatures) ? distinctiveFeatures : [],
        foundDate: foundDate ? new Date(foundDate) : new Date(),
        latitude: foundLocation?.latitude || 37.7749,
        longitude: foundLocation?.longitude || -122.4194,
        address: foundLocation?.address || null,
        city: foundLocation?.city || 'San Francisco',
        state: foundLocation?.state || null,
        country: foundLocation?.country || null,
        approximateArea: foundLocation?.approximateArea || 'Campus Area',
        images: Array.isArray(images) ? images : [],
        status: 'ACTIVE',
      },
    });

    // Run Gemini image analysis & matching in background
    if (foundItem.images && foundItem.images.length > 0) {
      geminiService
        .analyzeImage(foundItem.images[0])
        .then(async (analysis) => {
          if (analysis) {
            await prisma.foundItem.update({
              where: { id: foundItem.id },
              data: {
                aiDescription: analysis.objectDescription,
                aiAnalysis: analysis as any,
              },
            });
            foundItem.aiDescription = analysis.objectDescription;
            foundItem.aiAnalysis = analysis as any;
          }
          await matchingService.matchFoundItem(foundItem);
        })
        .catch((err) => {
          console.warn('[FoundItem] Gemini analysis error, triggering matching anyway:', err);
          matchingService.matchFoundItem(foundItem).catch(console.warn);
        });
    } else {
      matchingService.matchFoundItem(foundItem).catch(console.warn);
    }

    res.status(201).json({
      success: true,
      data: {
        ...foundItem,
        _id: foundItem.id,
        foundLocation: {
          latitude: foundItem.latitude,
          longitude: foundItem.longitude,
          city: foundItem.city,
          state: foundItem.state,
          country: foundItem.country,
          approximateArea: foundItem.approximateArea,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getAllFoundItems = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, search, status = 'ACTIVE' } = req.query;

    const where: any = {};
    if (status) {
      where.status = String(status);
    }
    if (category && category !== 'All') {
      where.category = { equals: String(category), mode: 'insensitive' };
    }
    if (search) {
      const q = String(search);
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { color: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.foundItem.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, avatar: true, isVerified: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const formatted = items.map((item) => ({
      ...item,
      _id: item.id,
      userId: item.user ? { ...item.user, _id: item.user.id } : item.userId,
      foundLocation: {
        latitude: item.latitude,
        longitude: item.longitude,
        city: item.city,
        state: item.state,
        country: item.country,
        approximateArea: item.approximateArea,
      },
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
};

export const getFoundItemById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const item = await prisma.foundItem.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatar: true, isVerified: true } },
      },
    });

    if (!item) {
      res.status(404).json({ success: false, message: 'Found item not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        ...item,
        _id: item.id,
        userId: item.user ? { ...item.user, _id: item.user.id } : item.userId,
        foundLocation: {
          latitude: item.latitude,
          longitude: item.longitude,
          city: item.city,
          state: item.state,
          country: item.country,
          approximateArea: item.approximateArea,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFoundItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id;

    const item = await prisma.foundItem.findUnique({ where: { id } });
    if (!item) {
      res.status(404).json({ success: false, message: 'Found item not found' });
      return;
    }

    if (item.userId !== userId) {
      res.status(403).json({ success: false, message: 'Not authorized to delete this item' });
      return;
    }

    await prisma.foundItem.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Found item report deleted successfully' });
  } catch (err) {
    next(err);
  }
};
