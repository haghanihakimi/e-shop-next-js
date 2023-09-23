import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    let stockLow: any = [];
    const products = req.query.products || [];
    let parsedProducts = [];

    if (typeof products === 'string') {
        parsedProducts = JSON.parse(products);
    } else if (Array.isArray(products)) {
        parsedProducts = products;
    }

    if (req.method === 'GET') {

        try {
            const itemIds = parsedProducts.map((item: any) => item.id);

            const lowStockItems = await prisma.product.findMany({
                where: {
                    id: {
                        in: itemIds
                    },
                    stock: {
                        lte: 0
                    }
                }
            });

            if (lowStockItems.length > 0) {
                res.status(200).json(lowStockItems);
            }
            res.status(200).json(lowStockItems);

        } catch (e) {
            res.status(500).json({ error: "Unable to retrieve stock status at this moment" });
        }

    } else {
        res.status(405).end();
    }
}