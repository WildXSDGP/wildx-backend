const sql = require('../db/client');

// POST /api/sos/alert  — Flutter SOS button hold
const sendAlert = async (req, res) => {
  try {
    const {
      userId   = 'anonymous',
      deviceId = '',
      message  = 'Emergency SOS triggered',
      location,
    } = req.body;

    if (!location?.latitude || !location?.longitude) {
      return res.status(400).json({
        success: false,
        message: 'location.latitude and location.longitude are required',
      });
    }

    const result = await sql`
      INSERT INTO sos_alerts
        (user_id, device_id, latitude, longitude, park_name, block, accuracy, message)
      VALUES (
        ${userId},
        ${deviceId},
        ${location.latitude},
        ${location.longitude},
        ${location.parkName  || ''},
        ${location.block     || ''},
        ${location.accuracy  || 0},
        ${message}
      )
      RETURNING *
    `;

    const alert = result[0];
    console.log(`🚨 SOS ALERT #${alert.id} — [${location.latitude}, ${location.longitude}]`);

    res.status(201).json({
      success: true,
      message: 'SOS Alert received. Help is on the way.',
      alertId: alert.id,
      data:    alert,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/sos/alerts?status=pending
const getAlerts = async (req, res) => {
  try {
    const { status } = req.query;
    const alerts = status
      ? await sql`SELECT * FROM sos_alerts WHERE status = ${status} ORDER BY created_at DESC LIMIT 100`
      : await sql`SELECT * FROM sos_alerts ORDER BY created_at DESC LIMIT 100`;

    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/sos/alerts/:id/status
const updateAlertStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'acknowledged', 'resolved', 'false_alarm'];
    if (!valid.includes(status))
      return res.status(400).json({ success: false, message: `status must be: ${valid.join(', ')}` });

    const resolvedAt = status === 'resolved' ? new Date() : null;
    const result = await sql`
      UPDATE sos_alerts
      SET status = ${status}, resolved_at = ${resolvedAt}
      WHERE id = ${req.params.id}
      RETURNING *
    `;
    if (!result.length)
      return res.status(404).json({ success: false, message: 'Alert not found' });
    res.json({ success: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { sendAlert, getAlerts, updateAlertStatus };
