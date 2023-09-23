import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

import { getRateLimitMiddlewares } from '@/ratelimit';
import applyMiddleware from "@/ratelimit";
import applyRateLimit from '@/ratelimit';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json("Unauthorized access!");
        }
        try {
            await prisma.$transaction(async (prisma) => {
                const allOrders = await prisma.order.findMany({
                    where: {
                        userId: session?.user?.id,
                    },
                    include: {
                        items: true,
                    }
                });
                if(allOrders && allOrders.length > 0) {
                    return res.status(200).json(allOrders);
                }
            });
            return res.status(200).json([]);
        } catch (e) {
            return res.status(500).json({ error: "Unable to place order at this time. Please check your payment details and try again. 500" });
        } finally {
            await prisma.$disconnect();
        }

    } else {
        return res.status(405).end("Internal server error.");
    }
}