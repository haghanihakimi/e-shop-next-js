import type { NextApiRequest, NextApiResponse } from 'next';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const categories = req.query.categories || [];
    let relatedProducts = [];
    let parsedCategories = [];

    if (typeof categories === 'string') {
        parsedCategories = JSON.parse(categories);
    } else if (Array.isArray(categories)) {
        parsedCategories = categories;
    }

    if (req.method === 'GET') {
        try {
            for (let category of parsedCategories) {
                if (category !== null && category !== undefined) {
                    const fetchedProduct = await prisma.category.findUnique({
                        where: {
                            id: category.categoryId
                        },
                        include: {
                            ProductCategory: {
                                include: {
                                    product: true,
                                },
                            },
                        },
                    });
                    relatedProducts.push(fetchedProduct);
                }
            }

            res.status(200).json(relatedProducts);
        } catch (e) {
            res.status(500).json({ error: 'Unable to fetch product.' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}