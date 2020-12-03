import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import db from '../../../libs/db/db';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const session = await getSession({ req });
        if (!session) {
            res.status(401).end();
        }

        if (req.method === 'DELETE') {
            const id = Array.isArray(req.query.id) && req.query.id.length > 1 ? req.query.id[0] : (req.query.id as string);

            const results = await db.source.delete({
                where: { id: parseInt(id) },
                select: { title: true },
            });
            res.status(200).json({ name: results.title });
        } else {
            res.status(405).end();
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to Delete.' });
    }
};
