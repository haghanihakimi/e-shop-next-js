import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        try {
            await prisma.$transaction(async (prisma) => {
                const allBrands = await prisma.brand.findMany();
                if (allBrands && allBrands.length > 0) {
                    return res.status(200).json(allBrands);
                } else {
                    return res.status(200).json([]);
                }
            });
        } catch (e) {
            return res.status(500).json({ error: "Unable to fetch brands." });
        } finally {
            await prisma.$disconnect();
        }

    } else {
        return res.status(405).end("Internal server error.");
    }
}