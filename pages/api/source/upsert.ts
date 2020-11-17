import { NextApiRequest, NextApiResponse } from 'next';
import { SourceUpsertFields } from '../../../libs/apitypes';
import db from '../../../libs/db/db';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const source = req.body as SourceUpsertFields;

        const s = await db.source.upsert({
            where: { title: source.title },
            update: {
                author: source.author,
                citation: source.citation,
                link: source.link,
                pubyear: source.pubyear,
            },
            create: {
                author: source.author,
                citation: source.citation,
                link: source.link,
                pubyear: source.pubyear,
                title: source.title,
            },
        });

        res.status(200).redirect(`/source/${s.id}`).end();
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};