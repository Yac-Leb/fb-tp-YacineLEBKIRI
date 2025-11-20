import { Router } from 'express';
import { authRequired } from '../middlewares/auth.middleware.js';
import { createThread, getThreads, addMessage, getMessages } from '../controllers/thread.controller.js';

const router = Router();

router.get('/', getThreads);
router.post('/', authRequired, createThread);
router.get('/:id/messages', getMessages);
router.post('/:id/messages', authRequired, addMessage);

export default router;
