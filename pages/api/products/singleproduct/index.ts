import type { NextApiRequest, NextApiResponse } from 'next';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const productId = Number(req.query.product) || 1;

    if (req.method === 'GET') {
        try {
            const fetchProduct = await prisma.product.findUnique({
                where: {
                    id: productId,
                },
                include: {
                    categories: {
                        include: {
                            category: true,
                        },
                    },
                    brand: true,
                }
            });
            res.status(200).json(fetchProduct);
        } catch (e) {
            res.status(500).json({ error: 'Unable to fetch product.' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}