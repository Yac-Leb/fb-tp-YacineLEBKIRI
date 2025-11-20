import { Router } from 'express';
import { authRequired } from '../middlewares/auth.middleware.js';
import { createGroup, getGroups, joinGroup, leaveGroup } from '../controllers/group.controller.js';
import { getThreadsByGroup } from '../controllers/thread.controller.js';


const router = Router();

router.get('/', getGroups);
router.post('/', authRequired, createGroup);
router.post('/:id/join', authRequired, joinGroup);
router.post('/:id/leave', authRequired, leaveGroup);
// Récupérer les fils de discussion d’un groupe
router.get('/:id/threads', getThreadsByGroup);


export default router;
