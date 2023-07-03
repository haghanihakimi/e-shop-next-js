import type { NextApiRequest, NextApiResponse } from 'next';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const page = Number(req.query.page) || 15;

    if (req.method === 'GET') {
        try {
            const productsFetch = await prisma.product.findMany({
                skip: 0,
                take: page,
                include: {
                    categories: {
                        include: {
                            category: true,
                        },
                    },
                    brand: true,
                }
            });
            res.status(200).json(productsFetch);
        } catch (e) {
            res.status(500).json({ error: 'Unable to fetch products.' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}