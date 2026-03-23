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