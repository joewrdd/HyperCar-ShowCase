/**
 * Notification model representing a notification entity in the system.
 * This model is used to define the structure of a notification and 
 * handle instantiation and conversion of data from database rows.
 */
class Notification {
    /**
     * Creates an instance of the Notification class.
     * @constructor
     * @param {number} notification_id - The unique identifier for the notification.
     * @param {number} user_id - The ID of the user who will receive the notification.
     * @param {string} title - The title of the notification.
     * @param {string} message - The message content of the notification.
     * @param {string} type - The type of notification.
     * @param {string} date_created - The date the notification was created.
     * @param {boolean} is_read - The status indicating whether the notification has been read.
     */
    constructor(notification_id, user_id, title, message, type, date_created, is_read) {
        this.notification_id = notification_id;
        this.user_id = user_id;
        this.title = title;
        this.message = message;
        this.type = type;
        this.date_created = date_created;
        this.is_read = is_read;
    }

    /**
     * Converts a database row into a Notification instance.
     * @static
     * @param {Object} row - The database row representing a notification.
     * @param {number} row.notification_id - The unique identifier for the notification.
     * @param {number} row.user_id - The ID of the user receiving the notification.
     * @param {string} row.title - The title of the notification.
     * @param {string} row.message - The message content of the notification.
     * @param {string} row.type - The type of notification.
     * @param {string} row.date_created - The date the notification was created.
     * @param {boolean} row.is_read - The status indicating whether the notification has been read.
     * @returns {Notification} A new instance of the Notification class.
     */
    static fromRow(row) {
        return new Notification(
            row.notification_id,
            row.user_id,
            row.title,
            row.message,
            row.type,
            row.date_created,
            row.is_read
        );
    }
}

module.exports = Notification;
