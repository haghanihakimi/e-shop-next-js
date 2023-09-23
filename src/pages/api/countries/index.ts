import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    let countriesFetch:any = [{countries: null}];

    if (req.method === 'GET') {
        const session = await getServerSession(req, res, authOptions);

        if(!session){
            res.status(200).json(countriesFetch);
        }
        try {

            countriesFetch = await prisma.countries.findMany();
            res.status(200).json(countriesFetch);
        } catch (e) {
            res.status(500).json({ error: 'Unable to fetch countries list.' });
        }

    } else {
        res.status(405).end("Internal server error");
    }
}