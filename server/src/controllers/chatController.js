import prisma from '../lib/prisma.js';
import { z } from 'zod';
import axios from 'axios';

const chatSchema = z.object({
    patientId: z.string().uuid(),
    message: z.string().min(1),
});

export const sendMessage = async (req, res, next) => {
    try {
        const { patientId, message } = chatSchema.parse(req.body);

        // 1. Verify patient exists
        const patient = await prisma.patient.findUnique({ where: { id: patientId } });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        // 2. Store user message
        await prisma.chatMessage.create({
            data: {
                patientId,
                sender: 'user',
                content: message,
            },
        });

        // 3. Call AI Service (or mock)
        let aiResponseText = "I'm having trouble connecting to the AI brain right now.";

        try {
            // Check if AI service is configured
            if (process.env.AI_SERVICE_URL) {
                const aiResponse = await axios.post(process.env.AI_SERVICE_URL, {
                    message,
                    patient_context: patient
                });
                aiResponseText = aiResponse.data.response;
            } else {
                // Mock response if no URL
                aiResponseText = `[MOCK AI] responding to: ${message}. Patient history length: ${patient.medicalNotes ? patient.medicalNotes.length : 0}`;
            }
        } catch (err) {
            console.error("AI Service Error:", err.message);
            aiResponseText = "Sorry, I am unable to generate a response at this time.";
        }

        // 4. Store AI response
        const aiMessage = await prisma.chatMessage.create({
            data: {
                patientId,
                sender: 'assistant',
                content: aiResponseText,
            },
        });

        res.json({ response: aiResponseText, messageId: aiMessage.id });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        next(error);
    }
};

export const getChatHistory = async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const history = await prisma.chatMessage.findMany({
            where: { patientId },
            orderBy: { createdAt: 'asc' },
        });
        res.json(history);
    } catch (error) {
        next(error);
    }
};
