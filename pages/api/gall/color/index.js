import { DB } from '../../../../database';

export default async function getColors(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({message: "Only GET is supported."});
    }

    const data = DB.prepare('SELECT * from color ORDER BY color ASC').all();
    res.json(data);
}