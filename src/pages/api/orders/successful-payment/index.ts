import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const orderId = Number(req.query.orderId) || 1;
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json({data: "Unauthorized access!"});
        }

        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: session?.user?.email || '',
                }
            });
            const order = await prisma.order.findUnique({
                where: {
                    id: orderId,
                },
                include: {
                    items: true,
                    users: true,
                }
            });
            if(order) {
                if(order.userId === user?.id){
                    return res.status(200).json({data: order});
                }
                return res.status(401).json({data: "Unauthorized access!"});
            }
            return res.status(404).json({data: "Order not found!"});
        } catch (e) {
            return res.status(500).json({ data: 'Unable to load order.' });
        }

    } else {
        return res.status(405).end();
    }
}