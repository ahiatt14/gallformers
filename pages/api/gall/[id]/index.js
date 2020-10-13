import { DB } from '../../../../database';

export default async function getGallById(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({message: "Only GET is supported."});
    }

    let sql = 
        `SELECT gall.detachable, gall.texture, gall.alignment, gall.walls, gl.loc, species.*
        FROM gall
        INNER JOIN galllocation AS gl ON (gl.loc_id = gall.loc_id)
        INNER JOIN species ON (species.species_id = gall.species_id)
        WHERE gall.species_id = ?`;
    const gall = DB.prepare(sql).get(req.query.id);
    res.json(gall);
}