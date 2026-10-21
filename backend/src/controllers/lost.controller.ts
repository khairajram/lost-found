import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../types/index.js';
import { matchingService } from '../services/matching.service.js';
import { geminiService } from '../ai/gemini.service.js';

export const createLostItem = async (
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
      lostDate,
      lostLocation,
      images = [],
      privateVerificationDetails,
    } = req.body;

    const lostItem = await prisma.lostItem.create({
      data: {
        userId,
        title,
        description,
        category,
        brand: brand || null,
        model: model || null,
        color,
        distinctiveFeatures: Array.isArray(distinctiveFeatures) ? distinctiveFeatures : [],
        lostDate: lostDate ? new Date(lostDate) : new Date(),
        latitude: lostLocation?.latitude || 37.7749,
        longitude: lostLocation?.longitude || -122.4194,
        address: lostLocation?.address || null,
        city: lostLocation?.city || 'San Francisco',
        state: lostLocation?.state || null,
        country: lostLocation?.country || null,
        approximateArea: lostLocation?.approximateArea || 'University Campus',
        images: Array.isArray(images) ? images : [],
        status: 'ACTIVE',
        privateVerificationDetails: privateVerificationDetails || null,
      },
    });

    // Run Gemini image analysis & matching asynchronously in background
    if (lostItem.images && lostItem.images.length > 0) {
      geminiService
        .analyzeImage(lostItem.images[0])
        .then(async (analysis) => {
          if (analysis) {
            await prisma.lostItem.update({
              where: { id: lostItem.id },
              data: {
                aiDescription: analysis.objectDescription,
                aiAnalysis: analysis as any,
              },
            });
            lostItem.aiDescription = analysis.objectDescription;
            lostItem.aiAnalysis = analysis as any;
          }
          await matchingService.matchLostItem(lostItem);
        })
        .catch((err) => {
          console.warn('[LostItem] Gemini analysis error, triggering matching anyway:', err);
          matchingService.matchLostItem(lostItem).catch(console.warn);
        });
    } else {
      matchingService.matchLostItem(lostItem).catch(console.warn);
    }

    res.status(201).json({
      success: true,
      data: {
        ...lostItem,
        _id: lostItem.id,
        lostLocation: {
          latitude: lostItem.latitude,
          longitude: lostItem.longitude,
          city: lostItem.city,
          state: lostItem.state,
          country: lostItem.country,
          approximateArea: lostItem.approximateArea,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getAllLostItems = async (
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

    const items = await prisma.lostItem.findMany({
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
      lostLocation: {
        latitude: item.latitude,
        longitude: item.longitude,
        city: item.city,
        state: item.state,
        country: item.country,
        approximateArea: item.approximateArea,
      },
      // Privacy safeguard: never expose private verification detail to public browse
      privateVerificationDetails: undefined,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
};

export const getLostItemById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id;

    const item = await prisma.lostItem.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatar: true, isVerified: true } },
      },
    });

    if (!item) {
      res.status(404).json({ success: false, message: 'Lost item not found' });
      return;
    }

    const isOwner = item.userId === userId;

    res.status(200).json({
      success: true,
      data: {
        ...item,
        _id: item.id,
        userId: item.user ? { ...item.user, _id: item.user.id } : item.userId,
        lostLocation: {
          latitude: item.latitude,
          longitude: item.longitude,
          city: item.city,
          state: item.state,
          country: item.country,
          approximateArea: item.approximateArea,
        },
        privateVerificationDetails: isOwner ? item.privateVerificationDetails : undefined,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteLostItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id;

    const item = await prisma.lostItem.findUnique({ where: { id } });
    if (!item) {
      res.status(404).json({ success: false, message: 'Lost item not found' });
      return;
    }

    if (item.userId !== userId) {
      res.status(403).json({ success: false, message: 'Not authorized to delete this item' });
      return;
    }

    await prisma.lostItem.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Lost item report deleted successfully' });
  } catch (err) {
    next(err);
  }
};
