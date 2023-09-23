import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    // let products: any = req.query?.product;
    let favorites: any = [];

    if (req.method === 'GET') {
        const session = await getServerSession(req, res, authOptions);

        
        try {
            if (session) {
                await prisma.$transaction(async (prisma) => {
                    favorites = await prisma.favorites.findMany({
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
                    })
                });
                if(favorites && favorites.length > 0) {
                    res.status(200).json(favorites);
                }
                res.status(200).json([]);
            }
            res.status(401).json("Unauthorized Access!");
        } catch (e) {
            res.status(500).json({ error: "Unable to load favorites list." });
        } finally {
            await prisma.$disconnect();
        }

    } else {
        res.status(405).end("Internal server error.");
    }
}