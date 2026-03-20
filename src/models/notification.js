// src/models/Notification.js
/**
 * NOTIFICATION MODEL
 * This defines how alerts and messages are stored in our Neon Database.
 * It's designed to sync perfectly with the Flutter UI, sending 
 * the exact colors, emojis, and deep-link data the app needs.
 */

const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Notification = sequelize.define(
  'Notification',
  {
    /** * UNIQUE ID:
     * An auto-incrementing number (1, 2, 3...) for each notification.
     */
    id: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true,
    },

    /** * TARGET USER:
     * Who should see this? 
     * If this is empty (NULL), it's a "Global" notification for everyone.
     */
    userId: {
      type:  DataTypes.STRING(100),
      field: 'user_id',
    },

    /** * NOTIFICATION TYPE:
     * Tells the app what kind of alert this is (e.g., 'sighting' or 'conservation').
     * We use 'validate' to make sure only approved types are saved in the DB.
     */
    type: {
      type:         DataTypes.STRING(50),
      allowNull:    false,
      defaultValue: 'system',
      validate: {
        isIn: [['sighting', 'conservation', 'photo', 'park', 'system', 'welcome']],
      },
    },

    // The bold heading shown on the notification card
    title: {
      type:      DataTypes.STRING(200),
      allowNull: false,
    },

    // The detailed message or description
    message: {
      type:      DataTypes.TEXT,
      allowNull: false,
    },

    /** * VISUALS:
     * We store the emoji and hex colors directly in the DB.
     * This way, we can change the look of the app alerts from the 
     * backend without updating the Flutter app!
     */
    iconEmoji: {
      type:         DataTypes.STRING(10),
      defaultValue: '🔔',
      field:        'icon_emoji',
    },
    colorHex: {
      type:         DataTypes.STRING(7),
      defaultValue: '#2ECC71',
      field:        'color_hex',
    },
    bgColorHex: {
      type:         DataTypes.STRING(7),
      defaultValue: '#E8F5E9',
      field:        'bg_color_hex',
    },

    /** * ACTION DATA (Deep Linking):
     * This is a special field! We store JSON here (like an animal ID).
     * When the user taps the notification, the app reads this to 
     * open the exact right screen automatically.
     */
    actionData: {
      type:  DataTypes.TEXT,
      field: 'action_data',
    },

    // Tracks if the user has clicked/viewed the alert yet
    isRead: {
      type:         DataTypes.BOOLEAN,
      defaultValue: false,
      field:        'is_read',
    },

    // Automatic timestamp so the app can show "5 minutes ago"
    createdAt: {
      type:         DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field:        'created_at',
    },

    /** * SOFT DELETE:
     * Instead of deleting the record forever, we just mark it as 'deleted'.
     * This is safer for data recovery and analytics.
     */
    isDeleted: {
      type:         DataTypes.BOOLEAN,
      defaultValue: false,
      field:        'is_deleted',
    },
  },
  {
    tableName:  'notifications', // The table name in your Neon SQL
    timestamps: false,
  }
);

module.exports = Notification;