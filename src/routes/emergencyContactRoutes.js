// emergencyContactRoutes.js
const express = require('express');
const router  = express.Router();
const { getContacts, createContact, updateContact, deleteContact } =
  require('../controllers/emergencyContactController');

router.get('/',       getContacts);
router.post('/',      createContact);
router.put('/:id',    updateContact);
router.delete('/:id', deleteContact);

module.exports = router;
