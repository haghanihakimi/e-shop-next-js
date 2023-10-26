import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json(null);
        }

        let email = "";

        if (req.query.user) {
            if (Array.isArray(req.query.user)) {
                email = req.query.user.join(',');
            } else {
                email = req.query.user.toString();
            }
        }

        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            if (user && Object.keys(user).length > 0) {
                return res.status(200).json(user);
            }

            return res.status(200).json(null);
        } catch (e) {
            return res.status(500).json({ error: "Fetching user failed." });
        }
    } else {
        return res.status(405).end();
    }
}