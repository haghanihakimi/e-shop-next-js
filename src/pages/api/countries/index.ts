import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        let countriesFetch: any = [{ countries: null }];
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(200).json(countriesFetch);
        }
        try {
            countriesFetch = await prisma.countries.findMany();
            return res.status(200).json(countriesFetch);
        } catch (e) {
            return res.status(500).json('Unable to fetch countries list.');
        }

    } else {
        return res.status(405).end("Internal server error");
    }
}