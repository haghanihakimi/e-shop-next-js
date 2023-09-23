import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { utapi } from 'uploadthing/server';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            res.status(401).json(null);
        }

        try {
            let updateImage: any = null;
            await prisma.$transaction(async (prisma) => {
                // await utapi.deleteFiles("2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg");
                const currentImage = await prisma.user.findUnique({
                    where: {
                        id: session?.user?.id,
                    }
                });
                if (currentImage && currentImage?.photoKey !== null) {
                    await utapi.deleteFiles(currentImage.photoKey).then(async () => {
                        updateImage = await prisma.user.update({
                            where: {
                                id: session?.user?.id
                            },
                            data: {
                                photo: req.body?.user?.photo,
                                photoKey: req.body?.user?.imageKey
                            }
                        })
                    });
                } else {
                    updateImage = await prisma.user.update({
                        where: {
                            id: session?.user?.id
                        },
                        data: {
                            photo: req.body?.user?.photo,
                            photoKey: req.body?.user?.imageKey
                        }
                    })
                }

                if (updateImage) {
                    res.status(200).json("Image updated successfully.");
                } else {
                    res.status(500).json("Updating image failed.");
                }
            });
        } catch (e) {
            res.status(500).json({ error: "Fetching user failed." });
        } finally {
            await prisma.$disconnect();
        }

    } else {
        res.status(405).end();
    }
}