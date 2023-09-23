import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        try {
            await prisma.$transaction(async (prisma) => {
                const allCategories = await prisma.category.findMany();
                if (allCategories && allCategories.length > 0) {
                    return res.status(200).json(allCategories);
                } else {
                    return res.status(200).json([]);
                }
            });
        } catch (e) {
            return res.status(500).json({ error: "Unable to fetch categories." });
        } finally {
            await prisma.$disconnect();
        }

    } else {
        return res.status(405).end("Internal server error.");
    }
}