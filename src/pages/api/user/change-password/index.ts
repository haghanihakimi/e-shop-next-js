import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import isSamePass from '@/app/context/SamePass';
import hashPass from '@/app/context/HashPass';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json(null);
        }

        try {
            await prisma.$transaction(async (prisma) => {
                const originalUser = await prisma.user.findUnique({
                    where: {
                        id: session?.user?.id,
                    },
                });

                if (originalUser) {
                    if ((await isSamePass(req.body?.user?.currentPassword, originalUser?.password))) {
                        const updatePassword = await prisma.user.update({
                            where: {
                                id: session?.user?.id,
                            },
                            data: {
                                password: await hashPass(req.body?.user?.newPassword),
                            },
                        });
                        return res.status(200).json("Your password successfully updated.");
                    } else {
                        return res.status(401).json("Your current password is incorrect. Please enter your current password before changing it.");
                    }
                } else {
                    return res.status(404).json("User not found");
                }
            });
        } catch (e) {
            return res.status(500).json({ error: "Fetching user failed." });
        } finally {
            await prisma.$disconnect();
        }

    } else {
        return res.status(405).end();
    }
}