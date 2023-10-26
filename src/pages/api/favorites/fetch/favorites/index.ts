import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const session = await getServerSession(req, res, authOptions);

        if (session) {
            try {
                await prisma.$transaction(async (prisma) => {
                    const favorites = await prisma.favorites.findMany({
                        where: {
                            userId: session?.user?.id,
                        },
                        include: {
                            products: {
                                include: {
                                    brand: true,
                                    categories: {
                                        include: {
                                            category: true
                                        }
                                    },
                                },
                            }
                        }
                    });

                    if (favorites && favorites.length > 0) {
                        return res.status(200).json(favorites);
                    } else {
                        return res.status(200).json([]);
                    }
                });
            } catch (e) {
                return res.status(500).json({ error: "Unable to load favorites list." });
            } finally {
                await prisma.$disconnect();
            }
        } else {
            return res.status(401).json("Unauthorized Access!");
        }
    } else {
        return res.status(405).end("Method Not Allowed");
    }
}