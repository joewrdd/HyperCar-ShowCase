const notificationService = require('../services/notificationService');

/**
 * Controller class for handling notification-related API requests.
 * Manages HTTP request handling for notification operations such as retrieving,
 * creating, updating, and deleting notifications.
 */
class NotificationController {

    /**
     * Handles the request to retrieve all notifications for a specific user.
     * @async
     * @param {Object} req - Express request object containing `user_id` in params.
     * @param {Object} res - Express response object.
     */
    async getAllNotificationsByUserId(req, res) {
        try {
            const userId = parseInt(req.params.user_id, 10);
            const notifications = await notificationService.getAllNotificationsByUserId(userId);
            res.json(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to retrieve a notification by ID.
     * @async
     * @param {Object} req - Express request object containing `notification_id` in params.
     * @param {Object} res - Express response object.
     */
    async getNotificationById(req, res) {
        try {
            const notificationId = parseInt(req.params.notification_id, 10);
            const notification = await notificationService.getNotificationById(notificationId);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.json(notification);
        } catch (error) {
            console.error('Error fetching notification:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to create a new notification.
     * @async
     * @param {Object} req - Express request object containing `user_id`, `title`, `message`, and `type` in the body.
     * @param {Object} res - Express response object.
     */
    async createNotification(req, res) {
        try {
            const { user_id, title, message, type } = req.body;
            if (!user_id || !title || !message || !type) {
                return res.status(400).json({ message: 'User ID, title, message, and type are required' });
            }
            const newNotification = await notificationService.createNotification({ user_id, title, message, type });
            res.status(201).json(newNotification);
        } catch (error) {
            console.error('Error creating notification:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to mark a notification as read.
     * @async
     * @param {Object} req - Express request object containing `notification_id` in params.
     * @param {Object} res - Express response object.
     */
    async markAsRead(req, res) {
        try {
            const notificationId = parseInt(req.params.notification_id, 10);
            const success = await notificationService.markAsRead(notificationId);
            if (!success) {
                return res.status(404).json({ message: 'Notification not found or already marked as read' });
            }
            res.json({ message: 'Notification marked as read successfully!' });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to delete a notification by ID.
     * @async
     * @param {Object} req - Express request object containing `notification_id` in params.
     * @param {Object} res - Express response object.
     */
    async deleteNotification(req, res) {
        try {
            const notificationId = parseInt(req.params.notification_id, 10);
            const success = await notificationService.deleteNotification(notificationId);
            if (!success) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.json({ message: 'Notification deleted successfully!' });
        } catch (error) {
            console.error('Error deleting notification:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new NotificationController();
