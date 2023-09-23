import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    let user:any = {user: null};
    let email = "";

    if (req.method === 'GET') {
        const session = await getServerSession(req, res, authOptions);

        if(session){
            res.status(401).json(null);
        }
        
        if (req.query.user) {
            if (Array.isArray(req.query.user)) {
                email = req.query.user.join(',');
            } else {
                email = req.query.user.toString();
            }
        }
        try {
            user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });
            if(user && Object.keys(user).length > 0) {
                res.status(200).json(user);
            }
            res.status(200).json(null);
        } catch (e) {
            res.status(500).json({ error: "Fetching user failed." });
        }

    } else {
        res.status(405).end();
    }
}