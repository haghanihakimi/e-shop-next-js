import type { NextApiRequest, NextApiResponse } from 'next';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {

        try {
            const getUser = await prisma.user.findUnique({
                where: {
                    email: 'john@email.com'
                }
            });
            return res.status(200).json(getUser);
        } catch (e) {
            return res.status(500).json({ error: 'Unable to fetch countries list.' });
        }

    } else {
        return res.status(405).end();
    }
}