import type { NextApiRequest, NextApiResponse } from 'next';
import hashPass from '@/app/context/HashPass';
import moment from 'moment';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        const inputs = req.body?.user;
        const errors: Array<any> = [];
        const password = await hashPass(inputs?.password);
        const namePatterns = /^[a-zA-Z]{2,16}$/;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const session = await getServerSession(req, res, authOptions);

        if (session) {
            return res.status(401).json('Invalid request!');
        }

        try {
            if (!namePatterns.test(inputs?.firstname)) {
                errors.push("First name must be maximum 16 characters and letters A-z.");
            }
            if (!namePatterns.test(inputs?.lastname)) {
                errors.push("Lastname must be maximum 16 characters and letters A-z.");
            }
            if (!emailPattern.test(inputs?.email)) {
                errors.push("Your email format is incorrect. Please check email input and try again.");
            }
            if (inputs?.password.length <= 5) {
                errors.push("Your password is too short! Please choose a stronger password.");
            }

            if (errors.length <= 0) {
                const getUser = await prisma.user.findUnique({
                    where: {
                        email: inputs?.email
                    }
                });
                if (!getUser) {
                    const user = await prisma.user.create({
                        data: {
                            firstname: inputs?.firstname,
                            surname: inputs?.lastname,
                            email: inputs?.email,
                            emailVerified: moment().toISOString(),
                            password: password
                        }
                    });
                    if (user) {
                        return res.status(200).json(true);
                    } else {
                        return res.status(500).json("OOPS! Sorry, something went wrong with creating your account.");
                    }
                } else {
                    return res.status(409).json("This email is already taken. Please use different email address to create account.");
                }
            } else {
                return res.status(422).json(errors);
            }
        } catch (e: any) {
            return res.status(500).json(e.response);
        }

    } else {
        return res.status(405).end();
    }
}