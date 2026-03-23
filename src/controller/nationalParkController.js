// Tables: national_parks, park_animal_types, park_rules
const { query } = require('../config/db');

// Helper — attach animals + rules to each park
async function enrichPark(park) {
  const [animals, rules] = await Promise.all([
    query('SELECT animal_type FROM park_animal_types WHERE park_id=$1', [park.id]),
    query('SELECT id, rule FROM park_rules WHERE park_id=$1 ORDER BY id', [park.id]),
  ]);
  return {
    ...park,
    animal_types: animals.rows.map(a => a.animal_type),
    rules: rules.rows,
  };
}

// GET /api/national-parks
exports.getAllParks = async (req, res, next) => {
  try {
    const r = await query(
      `SELECT * FROM national_parks WHERE is_active=true ORDER BY name`
    );
    const result = await Promise.all(r.rows.map(enrichPark));
    res.json({ success: true, parks: result });
  } catch (err) { next(err); }
};

// GET /api/national-parks/:id
exports.getParkById = async (req, res, next) => {
  try {
    const r = await query(
      'SELECT * FROM national_parks WHERE id=$1 AND is_active=true', [req.params.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Park not found' });
    res.json({ success: true, park: await enrichPark(r.rows[0]) });
  } catch (err) { next(err); }
};

// GET /api/national-parks/search?animal=Elephant&q=yala
exports.searchParks = async (req, res, next) => {
  try {
    const { animal, q } = req.query;
    let parks = [];

    if (animal) {
      // Search by animal type via park_animal_types join
      const r = await query(
        `SELECT np.* FROM national_parks np
         JOIN park_animal_types pat ON pat.park_id = np.id
         WHERE np.is_active=true
           AND pat.animal_type ILIKE $1
         ORDER BY np.name`,
        [`%${animal}%`]
      );
      parks = r.rows;
    } else if (q) {
      const r = await query(
        `SELECT * FROM national_parks
         WHERE is_active=true AND (name ILIKE $1 OR location ILIKE $1)
         ORDER BY name`,
        [`%${q}%`]
      );
      parks = r.rows;
    } else {
      const r = await query('SELECT * FROM national_parks WHERE is_active=true ORDER BY name');
      parks = r.rows;
    }

    const result = await Promise.all(parks.map(enrichPark));
    res.json({ success: true, parks: result });
  } catch (err) { next(err); }
};

// Aliases
exports.getAll        = exports.getAllParks;
exports.getById       = exports.getParkById;
exports.searchByAnimal = exports.searchParks;

// POST /api/national-parks (admin)
exports.create = async (req, res, next) => {
  try {
    const { name, description, location, sizeInHectares, openingTime,
            closingTime, entryFee, imageUrl, contactNumber, email,
            bestVisitingSeason } = req.body;
    const r = await query(
      `INSERT INTO national_parks
         (name,description,location,size_in_hectares,opening_time,closing_time,
          entry_fee,image_url,contact_number,email,best_visiting_season,is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true) RETURNING *`,
      [name,description,location,sizeInHectares,openingTime,closingTime,
       entryFee,imageUrl,contactNumber,email,bestVisitingSeason]
    );
    res.status(201).json({ success: true, park: r.rows[0] });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const r = await query(
      `UPDATE national_parks SET
         name=COALESCE($1,name), description=COALESCE($2,description),
         location=COALESCE($3,location), image_url=COALESCE($4,image_url),
         entry_fee=COALESCE($5,entry_fee)
       WHERE id=$6 RETURNING *`,
      [req.body.name,req.body.description,req.body.location,
       req.body.imageUrl,req.body.entryFee, req.params.id]
    );
    res.json({ success: true, park: r.rows[0] });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await query('UPDATE national_parks SET is_active=false WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Park deactivated' });
  } catch (err) { next(err); }
};