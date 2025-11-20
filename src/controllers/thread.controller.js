import { Thread } from '../models/Thread.js';
import { Message } from '../models/Message.js';
import { z } from 'zod';

// Validation pour créer un thread
const threadSchema = z.object({
  title: z.string().min(3),
  group: z.string().optional(),
  event: z.string().optional(),
});

// ➕ Créer un fil de discussion
export const createThread = async (req, res, next) => {
  try {
    const data = threadSchema.parse(req.body);
    const userId = req.user._id;

    if (data.group && data.event) {
      return res.status(400).json({ error: 'Thread cannot be linked to both a group and an event' });
    }

    if (!data.group && !data.event) {
      return res.status(400).json({ error: 'Thread must be linked to a group or an event' });
    }

    const thread = await Thread.create({
      ...data,
      createdBy: userId,
    });

    res.status(201).json(thread);
  } catch (err) {
    next(err);
  }
};

// 📋 Lister les threads
export const getThreads = async (req, res, next) => {
  try {
    const threads = await Thread.find()
      .populate('createdBy', 'firstName lastName email')
      .populate('group', 'name')
      .populate('event', 'name');
    res.json(threads);
  } catch (err) {
    next(err);
  }
};

// 💬 Ajouter un message dans un thread
export const addMessage = async (req, res, next) => {
  try {
    const { content, replyTo } = req.body;
    const threadId = req.params.id;
    const userId = req.user._id;

    const message = await Message.create({
      thread: threadId,
      author: userId,
      content,
      replyTo: replyTo || null,
    });

    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

// 📚 Récupérer tous les messages d’un thread
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ thread: req.params.id })
      .populate('author', 'firstName lastName email')
      .populate('replyTo');
    res.json(messages);
  } catch (err) {
    next(err);
  }
};


// 🧩 Threads d’un groupe
export const getThreadsByGroup = async (req, res, next) => {
  try {
    const groupId = req.params.id;
    const threads = await Thread.find({ group: groupId })
      .populate('createdBy', 'firstName lastName email')
      .populate('group', 'name')
      .populate('event', 'name');
    res.json(threads);
  } catch (err) {
    next(err);
  }
};

// 🧩 Threads d’un événement
export const getThreadsByEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const threads = await Thread.find({ event: eventId })
      .populate('createdBy', 'firstName lastName email')
      .populate('group', 'name')
      .populate('event', 'name');
    res.json(threads);
  } catch (err) {
    next(err);
  }
};
