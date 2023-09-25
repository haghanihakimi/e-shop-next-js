import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            if (req.query.search && req.query.search.length > 0) {
                const search = await prisma.product.findMany({
                    where: {
                        OR: [
                            {
                                title: {
                                    contains: req.query.search
                                }
                            },
                            {
                                sku: {
                                    contains: req.query.search
                                }
                            }
                        ],
                    },
                    include: {
                        categories: {
                            include: {
                                category: true,
                            }
                        }
                    },
                    take: 10
                });
                if (search && search.length > 0) {
                    return res.status(200).json(search);
                } else {
                    return res.status(200).json([]);
                }
            } else {
                return res.status(200).json([]);
            }
        } catch (e) {
            return res.status(500).json({ data: 'Unable to fetch search results!' });
        }

    } else {
        return res.status(405).end();
    }
}