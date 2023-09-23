import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const categoryId = Number(req.query.categoryId) || 1;
        try {
            await prisma.$transaction(async (prisma) => {
                const allCategoryProducts = await prisma.category.findUnique({
                    where: {
                        id: categoryId,
                    },
                    include: {
                        ProductCategory: {
                            include: {
                                product: {
                                    include: {
                                        categories: {
                                            include: {
                                                category: true,
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                if (allCategoryProducts && Object.keys(allCategoryProducts).length > 0) {
                    res.status(200).json(allCategoryProducts);
                } else {
                    res.status(200).json([]);
                }
            });
        } catch (e) {
            res.status(500).json({ error: "Unable to fetch category products." });
        } finally {
            await prisma.$disconnect();
        }

    } else {
        res.status(405).end("Internal server error.");
    }
}