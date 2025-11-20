import { Evenement } from '../models/Evenement.js';
import { z } from 'zod';

// Schéma de validation Zod
const eventSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string().min(2),
  coverImage: z.string().url().optional(),
  isPV: z.boolean().optional()
});

// Créer un événement
export const createEvent = async (req, res, next) => {
  try {
    const data = eventSchema.parse(req.body);
    const organizerId = req.user._id;

    const event = await Evenement.create({
      ...data,
      organisateurs: [organizerId],
      participants: [organizerId] // L'organisateur participe automatiquement
    });

    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

// Lister les événements
export const getEvents = async (req, res, next) => {
  try {
    const events = await Evenement.find()
      .populate('organisateurs', 'firstName lastName email')
      .populate('participants', 'firstName lastName email');
    res.json(events);
  } catch (err) {
    next(err);
  }
};

// Supprimer un événement (seulement par un organisateur)
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Evenement.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const isOrganizer = event.organisateurs.some(
      (org) => org.toString() === req.user._id.toString()
    );
    if (!isOrganizer) return res.status(403).json({ error: 'Not allowed' });

    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
};


// Rejoindre un événement
export const joinEvent = async (req, res, next) => {
  try {
    const event = await Evenement.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const userId = req.user._id;

    // Vérifie si l'utilisateur est déjà participant
    if (event.participants.includes(userId)) {
      return res.status(400).json({ error: 'Already joined' });
    }

    event.participants.push(userId);
    await event.save();

    res.json({ message: 'Successfully joined the event', event });
  } catch (err) {
    next(err);
  }
};
