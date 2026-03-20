const sql = require('../db/client');

// POST /api/location/update — Flutter share location button
const updateLocation = async (req, res) => {
  try {
    const {
      userId    = 'anonymous',
      deviceId  = '',
      latitude,
      longitude,
      parkName  = '',
      block     = '',
      accuracy  = 0,
    } = req.body;

    if (!latitude || !longitude)
      return res.status(400).json({ success: false, message: 'latitude and longitude are required' });

    const result = await sql`
      INSERT INTO user_locations (user_id, device_id, latitude, longitude, park_name, block, accuracy)
      VALUES (${userId}, ${deviceId}, ${latitude}, ${longitude}, ${parkName}, ${block}, ${accuracy})
      RETURNING *
    `;
    res.status(201).json({ success: true, message: 'Location saved', data: result[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/location/history/:userId
const getLocationHistory = async (req, res) => {
  try {
    const locations = await sql`
      SELECT * FROM user_locations
      WHERE user_id = ${req.params.userId}
      ORDER BY created_at DESC
      LIMIT 10
    `;
    res.json({ success: true, data: locations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { updateLocation, getLocationHistory };
