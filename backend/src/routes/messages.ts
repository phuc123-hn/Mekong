import express from 'express';
import { authMiddleware, requireRole, AuthRequest } from '../middleware/auth';
import { Message } from '../models/Message';
import mongoose from 'mongoose';

const router = express.Router();

// GET inbox for farmer (messages sent to farmers or broadcasts)
router.get('/inbox', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!.userId);

    const messages = await Message.find({
      $or: [
        { receiverId: userId }, // Messages to this user
        { receiverId: null }, // Broadcast messages
      ],
    })
      .populate('senderId', 'fullName phone')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch inbox' });
  }
});

// GET government inbox (messages from farmers)
router.get('/gov-inbox', authMiddleware, requireRole('GOVERNMENT'), async (req: AuthRequest, res) => {
  try {
    const messages = await Message.find({
      receiverId: new mongoose.Types.ObjectId(req.user!.userId),
    })
      .populate('senderId', 'fullName phone role')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch government inbox' });
  }
});

// POST send message (from farmer to government or broadcast)
router.post('/send', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { content, receiverId } = req.body; // receiverId can be null for broadcast
    const senderId = new mongoose.Types.ObjectId(req.user!.userId);

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'content is required' });
    }

    const receiver = receiverId ? new mongoose.Types.ObjectId(receiverId) : null;

    const newMessage = new Message({
      senderId,
      receiverId: receiver,
      content: content.trim(),
      isRead: false,
    });

    await newMessage.save();

    // Populate sender info for response
    const populatedMessage = await newMessage.populate('senderId', 'fullName phone');

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// POST mark message as read
router.post('/mark-read/:messageId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    ).populate('senderId', 'fullName phone');

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// DELETE message
router.delete('/:messageId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
