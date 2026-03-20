const { pool } = require('./db');

const SightingModel = {

  /** සියලුම sightings — optional filter by animal_type **/
  async getAll({ animalType, limit = 50, offset = 0 } = {}) {
    let query  = 'SELECT * FROM sighting_reports';
    const vals = [];

    if (animalType) {
      vals.push(animalType);
      query += ` WHERE animal_type = $${vals.length}`;
    }

    query += ` ORDER BY reported_at DESC LIMIT $${vals.length + 1} OFFSET $${vals.length + 2}`;
    vals.push(limit, offset);

    const result = await pool.query(query, vals);
    return result.rows;
  },

  /** ID ලා single sighting **/
  async getById(id) {
    const result = await pool.query(
      'SELECT * FROM sighting_reports WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  /** New sighting create **/
  async create({ animalType, photoPath, locationName, latitude, longitude, notes }) {
    const result = await pool.query(
      `INSERT INTO sighting_reports
         (animal_type, photo_path, location_name, latitude, longitude, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'submitted')
       RETURNING *`,
      [animalType, photoPath || null, locationName, latitude, longitude, notes || null]
    );
    return result.rows[0];
  },

  /** Status update (submitted → verified / rejected) **/
  async updateStatus(id, status) {
    const result = await pool.query(
      `UPDATE sighting_reports SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0] || null;
  },

  /** Delete **/
  async delete(id) {
    const result = await pool.query(
      'DELETE FROM sighting_reports WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount > 0;
  },

  /** Count by animal type — stats **/
  async getStats() {
    const result = await pool.query(`
      SELECT animal_type,
             COUNT(*)                                    AS total,
             COUNT(*) FILTER (WHERE status = 'verified') AS verified
      FROM sighting_reports
      GROUP BY animal_type
      ORDER BY total DESC
    `);
    return result.rows;
  },
};

module.exports = SightingModel;
