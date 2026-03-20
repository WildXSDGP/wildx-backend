// src/routes/notificationRoutes.js
// ─────────────────────────────────────────────────────────────────────────────
// Express router for all /api/v1/notifications endpoints.
//
// Flutter Notification page → endpoint map:
//   Page loads (all)          GET    /api/v1/notifications
//   Filter by type            GET    /api/v1/notifications?type=sighting
//   Filter unread only        GET    /api/v1/notifications?unread=true
//   Bell badge count          GET    /api/v1/notifications/unread-count
//   Single notification       GET    /api/v1/notifications/:id
//   Tap a notification card   PATCH  /api/v1/notifications/:id/read
//   "Mark all as read" button PATCH  /api/v1/notifications/read-all
//   Swipe to dismiss          DELETE /api/v1/notifications/:id
//   "Clear all" button        DELETE /api/v1/notifications/delete-all
//   Admin creates new one     POST   /api/v1/notifications
// ─────────────────────────────────────────────────────────────────────────────

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/notificationController');

// ── IMPORTANT: static named routes MUST come before /:id ─────────────────────
// If read-all or delete-all are placed AFTER /:id, Express treats the
// words "read-all" and "delete-all" as dynamic id values.

// GET /api/v1/notifications/unread-count
// Returns { count: 3 } — used for the bell badge number in Flutter
router.get('/unread-count', controller.getUnreadCount);

// PATCH /api/v1/notifications/read-all
// Marks all notifications as read — "Mark all as read" button
router.patch('/read-all', controller.markAllAsRead);

// DELETE /api/v1/notifications/delete-all
// Soft deletes all notifications — "Clear all" button
router.delete('/delete-all', controller.deleteAllNotifications);

// GET /api/v1/notifications
// All notifications (optional ?type=sighting &userId=x &unread=true filters)
router.get('/', controller.getAllNotifications);

// POST /api/v1/notifications
// Create a new notification (admin / system use)
router.post('/', controller.createNotification);

// GET /api/v1/notifications/:id
// Single notification by id
router.get('/:id', controller.getNotificationById);

// PATCH /api/v1/notifications/:id/read
// Mark one notification as read — called when user taps a card
router.patch('/:id/read', controller.markAsRead);

// DELETE /api/v1/notifications/:id
// Soft delete one notification — swipe to dismiss
router.delete('/:id', controller.deleteNotification);

module.exports = router;