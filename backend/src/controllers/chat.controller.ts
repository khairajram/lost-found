import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import { chatService } from '../services/chat.service.js';

export const getConversations = async (
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
    const conversations = await chatService.getUserConversations(userId);
    res.json({
      success: true,
      data: conversations,
    });
  } catch (err) {
    next(err);
  }
};

export const getOrCreateMatchConversation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { matchId } = req.params;
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const conversation = await chatService.getOrCreateConversation(matchId, userId);
    res.json({
      success: true,
      data: conversation,
    });
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const messages = await chatService.getMessages(id, userId);
    res.json({
      success: true,
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};

export const sendMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.body.senderId || req.user?._id || req.user?.id;
    const content = req.body.text || req.body.content || '';
    const imageUri = req.body.imageUri;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const message = await chatService.sendMessage(id, userId, content, imageUri);
    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (err) {
    next(err);
  }
};
