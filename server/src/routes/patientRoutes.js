import express from 'express';
import * as patientController from '../controllers/patientController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(auth); // Protect all routes

router.get('/', patientController.getPatients);
router.get('/:id', patientController.getPatientById);
router.post('/', patientController.createPatient);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

export default router;
