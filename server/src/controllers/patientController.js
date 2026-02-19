import prisma from '../lib/prisma.js';
import { z } from 'zod';

const patientSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(10),
    dob: z.string().or(z.date()), // Accepts string date or Date object
    medicalNotes: z.string().optional(),
});

export const getPatients = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [patients, total] = await Promise.all([
            prisma.patient.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.patient.count(),
        ]);

        res.json({
            patients,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        next(error);
    }
};

export const getPatientById = async (req, res, next) => {
    try {
        const patient = await prisma.patient.findUnique({
            where: { id: req.params.id },
            include: { chats: { orderBy: { createdAt: 'asc' } } },
        });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (error) {
        next(error);
    }
};

export const createPatient = async (req, res, next) => {
    try {
        const data = patientSchema.parse(req.body);
        // Ensure DOI is a Date object
        data.dob = new Date(data.dob);

        const patient = await prisma.patient.create({ data });
        res.status(201).json(patient);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        next(error);
    }
};

export const updatePatient = async (req, res, next) => {
    try {
        const data = patientSchema.partial().parse(req.body);
        if (data.dob) data.dob = new Date(data.dob);

        const patient = await prisma.patient.update({
            where: { id: req.params.id },
            data,
        });
        res.json(patient);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        next(error);
    }
};

export const deletePatient = async (req, res, next) => {
    try {
        await prisma.patient.delete({ where: { id: req.params.id } });
        res.json({ message: 'Patient deleted' });
    } catch (error) {
        next(error);
    }
};
