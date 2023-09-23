import type { NextApiRequest, NextApiResponse } from 'next';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const productId = Number(req.query.product) || 1;
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
            if(fetchProduct && Object.keys(fetchProduct).length > 0) {
                res.status(200).json(fetchProduct);
            }
            res.status(404).json("Product not found!");
        } catch (e) {
            res.status(500).json({ error: 'Unable to fetch product.' });
        }
    } else {
        res.status(405).end("Internal server error"); // Method Not Allowed
    }
}