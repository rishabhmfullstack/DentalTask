import express from 'express';
import * as chatController from '../controllers/chatController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(auth);

router.post('/', chatController.sendMessage);
router.get('/:patientId', chatController.getChatHistory);

export default router;
