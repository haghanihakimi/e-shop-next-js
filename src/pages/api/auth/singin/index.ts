import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import isSamePass from '@/app/context/SamePass';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        const session = await getSession({req});
        if(session) {
            res.status(401).json({authenticated: true});
        }
        try {
            const { email, password } = req.body;

            const getUser = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            })
            if (getUser !== null && Object.keys(getUser).length > 0) {
                if (await isSamePass(password, getUser.password)) {
                    res.status(200).json(getUser);
                    return;
                }
                res.status(500).json({ error: 'Incorrect email or password. Please check given email and password and try again.' });
                return;
            }
            res.status(500).json({ error: 'Incorrect email or password. Please check given email and password and try again.' });
            return
        } catch (e) {
            res.status(500).json({ error: 'Unable to fetch user.' });
        }

    } else {
        res.status(405).end();
    }
}