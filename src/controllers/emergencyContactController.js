const sql = require('../db/client');

// GET /api/contacts
const getContacts = async (req, res) => {
  try {
    const contacts = await sql`
      SELECT * FROM emergency_contacts
      WHERE is_active = TRUE
      ORDER BY priority ASC
    `;
    res.json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/contacts
const createContact = async (req, res) => {
  try {
    const { name, number, emoji = '📞', category = 'other', priority = 0 } = req.body;
    if (!name || !number)
      return res.status(400).json({ success: false, message: 'name and number are required' });

    const result = await sql`
      INSERT INTO emergency_contacts (name, number, emoji, category, priority)
      VALUES (${name}, ${number}, ${emoji}, ${category}, ${priority})
      RETURNING *
    `;
    res.status(201).json({ success: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/contacts/:id
const updateContact = async (req, res) => {
  try {
    const { name, number, emoji, category, priority, is_active } = req.body;
    const result = await sql`
      UPDATE emergency_contacts
      SET
        name       = COALESCE(${name},       name),
        number     = COALESCE(${number},     number),
        emoji      = COALESCE(${emoji},      emoji),
        category   = COALESCE(${category},   category),
        priority   = COALESCE(${priority},   priority),
        is_active  = COALESCE(${is_active},  is_active),
        updated_at = NOW()
      WHERE id = ${req.params.id}
      RETURNING *
    `;
    if (!result.length)
      return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/contacts/:id  (soft delete)
const deleteContact = async (req, res) => {
  try {
    const result = await sql`
      UPDATE emergency_contacts
      SET is_active = FALSE, updated_at = NOW()
      WHERE id = ${req.params.id}
      RETURNING id
    `;
    if (!result.length)
      return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, message: 'Contact deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getContacts, createContact, updateContact, deleteContact };
