import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../types/index.js';
import { chatService } from '../services/chat.service.js';

const formatMatch = (m: any) => {
  return {
    ...m,
    _id: m.id,
    lostItemId: m.lostItem
      ? {
          ...m.lostItem,
          _id: m.lostItem.id,
          lostLocation: {
            latitude: m.lostItem.latitude,
            longitude: m.lostItem.longitude,
            city: m.lostItem.city,
            state: m.lostItem.state,
            country: m.lostItem.country,
            approximateArea: m.lostItem.approximateArea,
          },
        }
      : m.lostItemId,
    foundItemId: m.foundItem
      ? {
          ...m.foundItem,
          _id: m.foundItem.id,
          foundLocation: {
            latitude: m.foundItem.latitude,
            longitude: m.foundItem.longitude,
            city: m.foundItem.city,
            state: m.foundItem.state,
            country: m.foundItem.country,
            approximateArea: m.foundItem.approximateArea,
          },
        }
      : m.foundItemId,
    lostUserId: m.lostUser ? { ...m.lostUser, _id: m.lostUser.id } : m.lostUserId,
    foundUserId: m.foundUser ? { ...m.foundUser, _id: m.foundUser.id } : m.foundUserId,
    similarityBreakdown: {
      visualSimilarity: m.visualSimilarity,
      categorySimilarity: m.categorySimilarity,
      colorSimilarity: m.colorSimilarity,
      brandSimilarity: m.brandSimilarity,
      locationSimilarity: m.locationSimilarity,
      dateSimilarity: m.dateSimilarity,
      descriptionSimilarity: m.descriptionSimilarity,
    },
    returnDetails: {
      meetingLocation: m.meetingLocation,
      meetingTime: m.meetingTime,
      confirmedByOwner: m.confirmedByOwner,
      confirmedByFinder: m.confirmedByFinder,
      handoverCompleted: m.handoverCompleted,
      notes: m.notes,
    },
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  };
};

export const getMatches = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { status } = req.query;

    const where: any = {
      OR: [{ lostUserId: userId }, { foundUserId: userId }],
    };

    if (status) {
      where.status = String(status);
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        lostItem: true,
        foundItem: true,
        lostUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
        foundUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
      },
      orderBy: { matchScore: 'desc' },
      take: 50,
    });

    res.status(200).json({
      success: true,
      data: matches.map(formatMatch),
    });
  } catch (err) {
    next(err);
  }
};

export const getMatchById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        lostItem: true,
        foundItem: true,
        lostUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
        foundUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
      },
    });

    if (!match) {
      res.status(404).json({ success: false, message: 'Match not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: formatMatch(match),
    });
  } catch (err) {
    next(err);
  }
};

export const acceptMatch = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id;

    const match = await prisma.match.findUnique({ where: { id } });
    if (!match) {
      res.status(404).json({ success: false, message: 'Match not found' });
      return;
    }

    const updated = await prisma.match.update({
      where: { id },
      data: { status: 'ACCEPTED' },
      include: {
        lostItem: true,
        foundItem: true,
        lostUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
        foundUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
      },
    });

    // Ensure conversation exists
    if (userId) {
      await chatService.getOrCreateConversation(id, userId).catch(console.warn);
    }

    res.status(200).json({
      success: true,
      data: formatMatch(updated),
    });
  } catch (err) {
    next(err);
  }
};

export const rejectMatch = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const updated = await prisma.match.update({
      where: { id },
      data: { status: 'REJECTED' },
      include: {
        lostItem: true,
        foundItem: true,
        lostUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
        foundUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
      },
    });

    res.status(200).json({
      success: true,
      data: formatMatch(updated),
    });
  } catch (err) {
    next(err);
  }
};

export const submitVerification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    const updated = await prisma.match.update({
      where: { id },
      data: {
        verificationStatus: 'PASSED',
        verificationAnswerProvided: answer,
        status: 'RETURN_IN_PROGRESS',
      },
      include: {
        lostItem: true,
        foundItem: true,
        lostUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
        foundUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
      },
    });

    res.status(200).json({
      success: true,
      data: formatMatch(updated),
    });
  } catch (err) {
    next(err);
  }
};

export const confirmReturned = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { meetingLocation, meetingTime, notes } = req.body;

    const match = await prisma.match.findUnique({ where: { id } });
    if (!match) {
      res.status(404).json({ success: false, message: 'Match not found' });
      return;
    }

    const updated = await prisma.match.update({
      where: { id },
      data: {
        status: 'RETURNED',
        handoverCompleted: true,
        meetingLocation: meetingLocation || undefined,
        meetingTime: meetingTime || undefined,
        notes: notes || undefined,
      },
      include: {
        lostItem: true,
        foundItem: true,
        lostUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
        foundUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
      },
    });

    // Also close the lost and found item records
    await prisma.lostItem.update({
      where: { id: match.lostItemId },
      data: { status: 'RETURNED' },
    });

    await prisma.foundItem.update({
      where: { id: match.foundItemId },
      data: { status: 'RETURNED' },
    });

    res.status(200).json({
      success: true,
      data: formatMatch(updated),
    });
  } catch (err) {
    next(err);
  }
};
