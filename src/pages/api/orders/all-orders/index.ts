import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json("Unauthorized access!");
        }

        try {
            const allOrders = await prisma.order.findMany({
                where: {
                    userId: session?.user?.id,
                },
                include: {
                    items: true,
                }
            });

            if (allOrders && allOrders.length > 0) {
                return res.status(200).json(allOrders);
            } else {
                // return res.status(200).json([]);
            }
        } catch (e) {
            // console.error(e);
            return res.status(500).json({ error: "Unable to fetch orders at this time." });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        return res.status(405).end("Method Not Allowed");
    }
}