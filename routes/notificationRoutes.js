const express = require('express');
const notificationController = require('../controllers/notificationController');
const { validateNotification, validateNotificationId } = require('../validators/notificationDTO');

const router = express.Router();

/**
 * @description Retrieve all notifications for a specific user by their `user_id`.
 * @route GET /notifications/user/:user_id
 * @param {number} user_id - The ID of the user whose notifications are being retrieved.
 * @access Public
 */
router.get('/user/:user_id', (req, res) => notificationController.getAllNotificationsByUserId(req, res));

/**
 * @description Retrieve a specific notification by its `notification_id`.
 * @route GET /notifications/:notification_id
 * @param {number} notification_id - The ID of the notification to retrieve.
 * @access Public
 */
router.get('/:notification_id', validateNotificationId, (req, res) => notificationController.getNotificationById(req, res));

/**
 * @description Create a new notification.
 * @route POST /notifications
 * @body {number} user_id - The ID of the user who will receive the notification.
 * @body {string} title - The title of the notification.
 * @body {string} message - The content/message of the notification.
 * @body {string} type - The type/category of the notification.
 * @access Public
 */
router.post('/', validateNotification, (req, res) => notificationController.createNotification(req, res));

/**
 * @description Mark a specific notification as read by its `notification_id`.
 * @route PUT /notifications/:notification_id/read
 * @param {number} notification_id - The ID of the notification to mark as read.
 * @access Public
 */
router.put('/:notification_id/read', validateNotificationId, (req, res) => notificationController.markAsRead(req, res));

/**
 * @description Delete a specific notification by its `notification_id`.
 * @route DELETE /notifications/:notification_id
 * @param {number} notification_id - The ID of the notification to delete.
 * @access Public
 */
router.delete('/:notification_id', validateNotificationId, (req, res) => notificationController.deleteNotification(req, res));

module.exports = router;
