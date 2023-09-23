import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const brandId = Number(req.query.brandId) || 1;
        try {
            await prisma.$transaction(async (prisma) => {
                const allBrandProducts = await prisma.brand.findUnique({
                    where: {
                        id: brandId,
                    },
                    include: {
                        products: {
                            include: {
                                categories: {
                                    include: {
                                        category: true
                                    }
                                }
                            }
                        }
                    }
                });
                if (allBrandProducts && Object.keys(allBrandProducts).length > 0) {
                    res.status(200).json(allBrandProducts);
                } else {
                    res.status(200).json([]);
                }
            });
        } catch (e) {
            res.status(500).json({ error: "Unable to fetch brands." });
        } finally {
            await prisma.$disconnect();
        }

    } else {
        res.status(405).end("Internal server error.");
    }
}