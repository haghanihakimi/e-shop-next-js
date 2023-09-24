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
                return res.status(200).json(fetchProduct);
            }
            return res.status(404).json("Product not found!");
        } catch (e) {
            return res.status(500).json({ error: 'Unable to fetch product.' });
        }
    } else {
        return res.status(405).end("Internal server error"); // Method Not Allowed
    }
}