import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {

        try {
            const uploadthingSecret = process.env.UPLOADTHING_SECRET;
            const uploadthingId = process.env.UPLOADTHING_APP_ID;
            const uploadthingURL = process.env.UPLOADTHING_URL;

            if (uploadthingSecret && uploadthingId && uploadthingURL) {
                res.status(200).json(true);
            } else {
                res.status(200).json(false);
            }
        } catch (e) {
            res.status(500).json({ error: "Checking UploadThing API key failed." });
        }

    } else {
        res.status(405).end();
    }
}