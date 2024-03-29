import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { PrismaClient } from '@prisma/client';
import applyRateLimit from '@/ratelimit';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const productId = req?.body?.productId;
    const brandId = req?.body?.brandId;
    let favorite: any = null;

    if (req.method === 'POST') {
        const session = await getServerSession(req, res, authOptions);

        try {
            await applyRateLimit(req, res)
        } catch(e) {
            return res.status(429).json("Oops! Slow down a bit. Too many requests.")
        }

        try {
            if (session && productId && productId > 0 && brandId && brandId > 0) {
                await prisma.$transaction(async (prisma) => {
                    const user = await prisma.user.findUnique({
                        where: {
                            email: session?.user?.email || '',
                        }
                    });
                    favorite = await prisma.favorites.findUnique({
                        where: {
                            userId_productId: {
                                userId: user?.id || 0,
                                productId: productId,
                            }
                        },
                    })
                    if (favorite && Object.keys(favorite).length > 0) {
                        favorite = await prisma.favorites.delete({
                            where: {
                                userId_productId: {
                                    userId: user?.id || 0,
                                    productId: productId,
                                }
                            },
                        })
                    } else {
                        favorite = await prisma.favorites.create({
                            data: {
                                userId: user?.id || 0,
                                productId: productId,
                                brandId: brandId,
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
                    }
                    return res.status(200).json(favorite);
                });
            }
        } catch (e) {
            return res.status(500).json({ error: "Unable to load favorites list." });
        } finally {
            await prisma.$disconnect();
        }

    } else {
        return res.status(405).end("Internal server error.");
    }
}