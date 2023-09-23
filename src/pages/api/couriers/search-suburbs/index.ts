import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {

        try {
            // 
        } catch (e) {
            res.status(500).json({ error: 'Unable to fetch countries list.' });
        }

    } else {
        res.status(405).end();
    }
}