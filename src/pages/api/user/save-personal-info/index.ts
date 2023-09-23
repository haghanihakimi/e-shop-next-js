import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ChangedField {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    let savePersonalInfo: any = null;
    let originalPersonalInfo: any = null;
    const changedFields: ChangedField = {
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
    };

    if (req.method === 'POST') {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            res.status(401).json(null);
        }

        try {
            await prisma.$transaction(async (prisma) => {
                originalPersonalInfo = await prisma.user.findUnique({
                    where: {
                        id: session?.user?.id
                    }
                })
                savePersonalInfo = await prisma.user.update({
                    where: {
                        id: session?.user?.id
                    },
                    data: {
                        firstname: req.body?.user?.firstname,
                        surname: req.body?.user?.lastname,
                        email: req.body?.user?.email,
                        phone: req.body?.user?.phone,
                    }
                })
            });

            if (savePersonalInfo && savePersonalInfo !== null) {
                if (savePersonalInfo.firstname !== originalPersonalInfo.firstname) {
                    changedFields.firstname = savePersonalInfo.firstname;
                }

                if (savePersonalInfo.surname !== originalPersonalInfo.surname) {
                    changedFields.lastname = savePersonalInfo.surname;
                }

                if (savePersonalInfo.email !== originalPersonalInfo.email) {
                    changedFields.email = savePersonalInfo.email;
                }

                if (savePersonalInfo.phone !== originalPersonalInfo.phone) {
                    changedFields.phone = savePersonalInfo.phone;
                }
                res.status(200).json(changedFields);
            }
            res.status(500).json("OOPS! Something went wrong with updating your personal information!");
        } catch (e) {
            res.status(500).json({ error: "Fetching user failed." });
        } finally {
            await prisma.$disconnect();
        }

    } else {
        res.status(405).end();
    }
}