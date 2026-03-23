const { query } = require('../config/db');

const VALID_ANIMAL_TYPES = [
  'SRI_LANKAN_LEOPARD', 'ASIAN_ELEPHANT', 'SPOTTED_DEER',
  'CROCODILE', 'WATER_BUFFALO', 'SLOTH_BEAR',
];

const ANIMAL_DISPLAY_NAMES = {
  SRI_LANKAN_LEOPARD: 'Sri Lankan Leopard',
  ASIAN_ELEPHANT:     'Asian Elephant',
  SPOTTED_DEER:       'Spotted Deer',
  CROCODILE:          'Crocodile',
  WATER_BUFFALO:      'Water Buffalo',
  SLOTH_BEAR:         'Sloth Bear',
};