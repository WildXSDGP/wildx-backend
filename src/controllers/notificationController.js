// src/controllers/notificationController.js
/**
 * NOTIFICATION CONTROLLER
 * This is the logic hub for the Alerts & Notifications system.
 * It handles fetching, marking as read, and soft-deleting notifications.
 */

const { Op }         = require('sequelize');
const Notification   = require('../models/Notification');

// ── UI CONFIGURATION ──────────────────────────────────────────────────────────
/**
 * TYPE COLORS:
 * We define these here so the backend can tell the Flutter app 
 * exactly which colors and emojis to use based on the alert type.
 */
const TYPE_COLORS = {
  sighting:     { colorHex: '#2ECC71', bgColorHex: '#E8F5E9', iconEmoji: '🐾' },
  conservation: { colorHex: '#E53935', bgColorHex: '#FFEBEE', iconEmoji: '⚠️' },
  photo:        { colorHex: '#007AFF', bgColorHex: '#E3F2FD', iconEmoji: '📷' },
  park:         { colorHex: '#FF9500', bgColorHex: '#FFF3E0', iconEmoji: '🌳' },
  system:       { colorHex: '#5856D6', bgColorHex: '#EEF0FF', iconEmoji: '🔔' },
  welcome:      { colorHex: '#00C7BE', bgColorHex: '#E0F7F6', iconEmoji: '👋' },
};

/**
 * CLEAN DATA FORMATTER:
 * Converts raw database rows into a format the Flutter UI loves.
 * It also parses 'actionData' from a String back into a JSON Object.
 */
function formatNotification(n) {
  const d = n.get ? n.get({ plain: true }) : n;
  return {
    id:          d.id,
    userId:      d.userId,
    type:        d.type,
    title:       d.title,
    message:     d.message,
    iconEmoji:   d.iconEmoji,
    colorHex:    d.colorHex,
    bgColorHex:  d.bgColorHex,
    actionData:  d.actionData ? JSON.parse(d.actionData) : null,
    isRead:      d.isRead,
    createdAt:   d.createdAt,
  };
}

// ── API FUNCTIONS ────────────────────────────────────────────────────────────

/**
 * GET ALL NOTIFICATIONS:
 * Fetches alerts for the user. It shows:
 * 1. Personal alerts (for that specific userId)
 * 2. Broadcast alerts (where userId is NULL - for everyone)
 * It ignores "Soft Deleted" records.
 */
const getAllNotifications = async (req, res) => {
  try {
    const { type, userId, unread } = req.query;
    const where = { isDeleted: false };

    if (type && type !== 'All') where.type = type;

    if (userId) {
      where[Op.or] = [
        { userId: userId }, // Private messages
        { userId: null },   // Public announcements
      ];
    }

    if (unread === 'true') where.isRead = false;

    const notifications = await Notification.findAll({
      where,
      order: [['createdAt', 'DESC']], // Newest alerts at the top
    });

    res.json(notifications.map(formatNotification));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching alerts: ' + err.message });
  }
};

/**
 * GET UNREAD COUNT:
 * This powers the little red badge (number) on the bell icon in Flutter.
 */
const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.query;
    const where = { isRead: false, isDeleted: false };

    if (userId) {
      where[Op.or] = [{ userId: userId }, { userId: null }];
    }

    const count = await Notification.count({ where });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * MARK AS READ:
 * Triggered when a user taps a specific notification card.
 */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, isDeleted: false },
    });

    if (!notification) return res.status(404).json({ message: 'Alert not found' });

    if (!notification.isRead) {
      await notification.update({ isRead: true });
    }

    res.json(formatNotification(notification));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * MARK ALL AS READ:
 * For the "Mark all as read" button in the UI.
 */
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.query;
    const where = { isRead: false, isDeleted: false };

    if (userId) {
      where[Op.or] = [{ userId: userId }, { userId: null }];
    }

    const [updatedCount] = await Notification.update({ isRead: true }, { where });
    res.json({ message: 'All caught up!', updatedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE NOTIFICATION:
 * This is a "Soft Delete". We don't remove it from the DB, 
 * we just hide it so the user doesn't see it anymore.
 */
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, isDeleted: false },
    });

    if (!notification) return res.status(404).json({ message: 'Alert not found' });

    await notification.update({ isDeleted: true });
    res.status(204).send(); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * CREATE NOTIFICATION:
 * Used by the system to send out new alerts.
 * It automatically picks the right colors based on the 'type' provided.
 */
const createNotification = async (req, res) => {
  try {
    const { type, title, message, userId, iconEmoji, actionData } = req.body;

    if (!type || !title || !message) {
      return res.status(400).json({ message: 'Type, title, and message are required' });
    }

    const typeDefaults = TYPE_COLORS[type] || TYPE_COLORS.system;

    const notification = await Notification.create({
      userId: userId || null,
      type,
      title,
      message,
      iconEmoji:  iconEmoji || typeDefaults.iconEmoji,
      colorHex:   typeDefaults.colorHex,
      bgColorHex: typeDefaults.bgColorHex,
      actionData: actionData ? JSON.stringify(actionData) : null,
      isRead:     false,
      createdAt:  new Date(),
    });

    res.status(201).json(formatNotification(notification));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  // Add others as needed
};