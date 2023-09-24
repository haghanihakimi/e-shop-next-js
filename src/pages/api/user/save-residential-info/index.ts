import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ChangedField {
    street: string;
    city: string;
    state: string;
    postcode: string;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        let saveResidentialInfo: any = null;
        let originalResidentialInfo: any = null;
        const changedFields: ChangedField = {
            street: '',
            city: '',
            state: '',
            postcode: '',
        };
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json(null);
        }

        try {
            await prisma.$transaction(async (prisma) => {
                originalResidentialInfo = await prisma.user.findUnique({
                    where: {
                        id: session?.user?.id
                    }
                })
                saveResidentialInfo = await prisma.user.update({
                    where: {
                        id: session?.user?.id
                    },
                    data: {
                        street: req.body?.user?.street,
                        city: req.body?.user?.city,
                        state: req.body?.user?.state,
                        postcode: req.body?.user?.postcode,
                    }
                })
            });

            if (saveResidentialInfo && saveResidentialInfo !== null) {
                if (saveResidentialInfo.street !== originalResidentialInfo.street) {
                    changedFields.street = saveResidentialInfo.street;
                }

                if (saveResidentialInfo.city !== originalResidentialInfo.city) {
                    changedFields.city = saveResidentialInfo.city;
                }

                if (saveResidentialInfo.state !== originalResidentialInfo.state) {
                    changedFields.state = saveResidentialInfo.state;
                }

                if (saveResidentialInfo.postcode !== originalResidentialInfo.postcode) {
                    changedFields.postcode = saveResidentialInfo.postcode;
                }
                return res.status(200).json(changedFields);
            }
            return res.status(500).json("OOPS! Something went wrong with updating your residential information!");
        } catch (e) {
            return res.status(500).json({ error: "Fetching user failed." });
        } finally {
            await prisma.$disconnect();
        }

    } else {
        return res.status(405).end();
    }
}