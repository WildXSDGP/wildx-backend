// src/seeders/notificationSeeder.js
/**
 * NOTIFICATION SEEDER
 * This file fills our database with sample alerts on the very first run.
 * It covers all the different types (Sightings, System, Park alerts, etc.)
 * so the Flutter UI looks great during testing.
 */

const Notification = require('../models/Notification');

/**
 * SAMPLE ALERTS:
 * We've added a mix of "Read" and "Unread" notifications with different 
 * timestamps to make the list look realistic (e.g., 30 mins ago, 7 days ago).
 */
const sampleNotifications = [
  // ── WELCOME MESSAGE ──────────────────────────────────────────────────
  {
    userId:     null,           // Broadcast: Everyone sees this
    type:       'welcome',
    title:      'Welcome to WildX! 👋',
    message:    'Start exploring Sri Lanka\'s incredible wildlife. Browse the gallery and share your sightings.',
    iconEmoji:  '👋',
    colorHex:   '#00C7BE',
    bgColorHex: '#E0F7F6',
    isRead:     false,
    createdAt:  new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
  },

  // ── WILDLIFE SIGHTING ───────────────────────────────────────────────
  {
    userId:     null,
    type:       'sighting',
    title:      'New Leopard Sighting in Yala! 🐆',
    message:    'A Sri Lankan Leopard was spotted near the water hole. Rangers confirmed two cubs were also seen.',
    iconEmoji:  '🐆',
    colorHex:   '#2ECC71',
    bgColorHex: '#E8F5E9',
    // ActionData: Tells the app to open Yala and the Leopard details
    actionData: JSON.stringify({ animalId: '1', parkName: 'Yala National Park' }),
    isRead:     false,
    createdAt:  new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
  },

  // ── CONSERVATION ALERT ──────────────────────────────────────────────
  {
    userId:     null,
    type:       'conservation',
    title:      'Conservation Alert: Purple-faced Langur',
    message:    'Population in Sinharaja has declined by 12%. Support conservation efforts to protect them.',
    iconEmoji:  '⚠️',
    colorHex:   '#E53935',
    bgColorHex: '#FFEBEE',
    actionData: JSON.stringify({ animalId: '5' }),
    isRead:     false,
    createdAt:  new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },

  // ── PARK ALERT ──────────────────────────────────────────────────────
  {
    userId:     null,
    type:       'park',
    title:      'Minneriya — Elephant Gathering Season 🐘',
    message:    'Over 300 elephants expected near the tank. Best viewing: 3pm–6pm daily.',
    iconEmoji:  '🐘',
    colorHex:   '#FF9500',
    bgColorHex: '#FFF3E0',
    actionData: JSON.stringify({ parkName: 'Minneriya National Park' }),
    isRead:     false,
    createdAt:  new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
  },

  // ── SYSTEM UPDATE ───────────────────────────────────────────────────
  {
    userId:     null,
    type:       'system',
    title:      'WildX v1.0.0 is Live!',
    message:    'First version of WildX is now available. More species coming soon!',
    iconEmoji:  '🚀',
    colorHex:   '#5856D6',
    bgColorHex: '#EEF0FF',
    isRead:     true, // Already read
    createdAt:  new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
];

/**
 * SEEDING FUNCTION:
 * This only runs if the 'notifications' table in Neon is completely empty.
 */
async function seedNotificationData() {
  try {
    const count = await Notification.count();

    if (count === 0) {
      // bulkCreate is much faster than adding them one by one
      await Notification.bulkCreate(sampleNotifications, {
        ignoreDuplicates: true,
      });
      console.log(`✅ Success: Seeded ${sampleNotifications.length} sample notifications`);
    } else {
      console.log(`ℹ️ Notifications table already has ${count} records — skipping seed`);
    }
  } catch (error) {
    console.error('❌ Notification seeder failed:', error.message);
    throw error;
  }
}

module.exports = seedNotificationData;