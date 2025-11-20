import { Group } from '../models/Group.js';
import { z } from 'zod';

// Validation Zod
const groupSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  icon: z.string().url().optional(),
  coverImage: z.string().url().optional(),
  type: z.enum(['public', 'private', 'secret']).optional(),
  allowMemberPosts: z.boolean().optional(),
  allowEventCreation: z.boolean().optional()
});

// ➕ Créer un groupe
export const createGroup = async (req, res, next) => {
  try {
    const data = groupSchema.parse(req.body);
    const userId = req.user._id;

    const group = await Group.create({
      ...data,
      admins: [userId],
      members: [userId]
    });

    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
};

// 📋 Lister les groupes
export const getGroups = async (req, res, next) => {
  try {
    const groups = await Group.find()
      .populate('admins', 'firstName lastName email')
      .populate('members', 'firstName lastName email');
    res.json(groups);
  } catch (err) {
    next(err);
  }
};

// 🙋 Rejoindre un groupe
export const joinGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const userId = req.user._id;

    if (group.members.includes(userId)) {
      return res.status(400).json({ error: 'Already a member' });
    }

    // Pour les groupes privés, on pourrait exiger une invitation
    if (group.type === 'private' || group.type === 'secret') {
      return res.status(403).json({ error: 'Cannot join this group directly' });
    }

    group.members.push(userId);
    await group.save();

    res.json({ message: 'Joined group successfully', group });
  } catch (err) {
    next(err);
  }
};

// 🚪 Quitter un groupe
export const leaveGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const userId = req.user._id;
    group.members = group.members.filter(
      (m) => m.toString() !== userId.toString()
    );

    // empêcher un admin de se retirer s'il est le seul
    if (group.admins.length === 1 && group.admins[0].toString() === userId.toString()) {
      return res.status(400).json({ error: 'Cannot leave: you are the only admin' });
    }

    await group.save();
    res.json({ message: 'Left group successfully', group });
  } catch (err) {
    next(err);
  }
};
