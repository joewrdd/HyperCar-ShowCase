const { initDB } = require('../config/database.js');
const Notification = require('../models/notificationModel.js');

/**
 * Service class for managing notification-related database operations.
 * Handles CRUD operations for the `notifications` table.
 */
class NotificationService {
    /**
     * Initializes the NotificationService instance and database connection pool.
     */
    constructor() {
        this.pool = null;
        this.init();
    }

    /**
     * Initializes the database connection pool.
     * @async
     */
    async init() {
        this.pool = await initDB();
    }

    /**
     * Retrieves all notifications for a specific user by user ID.
     * @async
     * @param {number} userId - The ID of the user whose notifications are to be retrieved.
     * @returns {Promise<Array<Notification>>} - Array of Notification objects for the specified user.
     */
    async getAllNotificationsByUserId(userId) {
        const [rows] = await this.pool.query('SELECT * FROM notifications WHERE user_id = ?', [userId]);
        return rows.map(Notification.fromRow);
    }

    /**
     * Retrieves a notification by its ID.
     * @async
     * @param {number} notificationId - The ID of the notification to retrieve.
     * @returns {Promise<Notification|null>} - Notification object if found, 
     * or null if no notification with the specified ID exists.
     */
    async getNotificationById(notificationId) {
        const [rows] = await this.pool.query('SELECT * FROM notifications WHERE notification_id = ?', [notificationId]);
        if (rows.length === 0) return null;
        return Notification.fromRow(rows[0]);
    }

    /**
     * Creates a new notification in the database.
     * @async
     * @param {Object} notificationData - Data for the new notification, containing `user_id`, `title`, `message`, and `type`.
     * @param {number} notificationData.user_id - The ID of the user who will receive the notification.
     * @param {string} notificationData.title - The title of the notification.
     * @param {string} notificationData.message - The message content of the notification.
     * @param {string} notificationData.type - The type/category of the notification.
     * @returns {Promise<Object>} - Object with `notification_id`, `user_id`, `title`, `message`,
     * `type`, and `is_read` status of the newly created notification.
     */
    async createNotification(notificationData) {
        const { user_id, title, message, type } = notificationData;
        const [result] = await this.pool.query(
            'INSERT INTO notifications (user_id, title, message, type, date_created, is_read) VALUES (?, ?, ?, ?, NOW(), FALSE)',
            [user_id, title, message, type]
        );
        return { notification_id: result.insertId, user_id, title, message, type, is_read: false };
    }

    /**
     * Marks a notification as read by its ID.
     * @async
     * @param {number} notificationId - The ID of the notification to mark as read.
     * @returns {Promise<boolean>} - `true` if the notification was marked as read, `false` otherwise.
     */
    async markAsRead(notificationId) {
        const [result] = await this.pool.query(
            'UPDATE notifications SET is_read = TRUE WHERE notification_id = ?',
            [notificationId]
        );
        return result.affectedRows > 0;
    }

    /**
     * Deletes a notification from the database by its ID.
     * @async
     * @param {number} notificationId - The ID of the notification to delete.
     * @returns {Promise<boolean>} - `true` if the notification was deleted, `false` otherwise.
     */
    async deleteNotification(notificationId) {
        const [result] = await this.pool.query('DELETE FROM notifications WHERE notification_id = ?', [notificationId]);
        return result.affectedRows > 0;
    }
}

module.exports = new NotificationService();
