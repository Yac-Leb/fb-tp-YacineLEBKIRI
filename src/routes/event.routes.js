import { Router } from 'express';
import { authRequired } from '../middlewares/auth.middleware.js';
import { createEvent, getEvents, deleteEvent, joinEvent} from '../controllers/event.controller.js';
import { getThreadsByEvent } from '../controllers/thread.controller.js';


const router = Router();

router.get('/', getEvents);
router.post('/', authRequired, createEvent);
router.delete('/:id', authRequired, deleteEvent);
router.post('/:id/join', authRequired, joinEvent);
router.get('/:id/threads', getThreadsByEvent);


export default router;
