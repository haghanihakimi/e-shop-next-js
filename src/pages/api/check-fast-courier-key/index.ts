import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {

        try {
            const fastcourerKey = process.env.NEXT_PUBLIC_FASTCOURIER_KEY;

            if (fastcourerKey) {
                return res.status(200).json(true);
            } else {
                res.status(200).json(false);
            }
        } catch (e) {
            return res.status(500).json({ error: "Checking Fast-Courier API key failed." });
        }

    } else {
        return res.status(405).end();
    }
}