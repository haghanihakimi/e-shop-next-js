import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req, res) {
    if (req.method === 'POST') {
        try {
            const brand = await prisma.brand.create({
                data: req.body,
            });
            res.status(200).json(brand);
        } catch (e) {
            res.status(500).json({ error: 'Unable to create brand' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}