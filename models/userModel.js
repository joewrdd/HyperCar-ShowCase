/**
 * User model representing a user entity in the system.
 * This model is used to define the structure of a user record and handle
 * instantiation and conversion of data from database rows.
 */
class User {
    /**
     * Creates an instance of the User class.
     * @constructor
     * @param {number} user_id - The unique identifier for the user.
     * @param {string} name - The name of the user.
     * @param {string} email - The email address of the user.
     * @param {string} password - The password of the user (hashed).
     * @param {string} created_at - The timestamp of when the user was created.
     * @param {string} updated_at - The timestamp of the last update to the user's record.
     */
    constructor(user_id, name, email, password, created_at, updated_at) {
        this.user_id = user_id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    /**
     * Converts a database row into a User instance.
     * @static
     * @param {Object} row - The database row representing a user.
     * @param {number} row.user_id - The unique identifier for the user.
     * @param {string} row.name - The name of the user.
     * @param {string} row.email - The email address of the user.
     * @param {string} row.password - The hashed password of the user.
     * @param {string} row.created_at - The timestamp when the user was created.
     * @param {string} row.updated_at - The timestamp when the user's record was last updated.
     * @returns {User} A new instance of the User class.
     */
    static fromRow(row) {
        return new User(
            row.user_id,
            row.name,
            row.email,
            row.password,
            row.created_at,
            row.updated_at
        );
    }
}

module.exports = User;
