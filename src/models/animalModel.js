const { pool } = require('./db');

const AnimalModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM animals ORDER BY name');
    return result.rows;
  },
};

module.exports = AnimalModel;
