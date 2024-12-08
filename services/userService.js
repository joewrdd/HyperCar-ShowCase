const { initDB } = require('../config/database.js');
const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');

/**
 * Service class for managing user-related database operations.
 * Handles CRUD operations for the `users` table and authentication-related logic.
 */
class UserService {

    /**
     * Initializes the UserService instance and database connection pool.
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
     * Retrieves all users from the database.
     * @async
     * @returns {Promise<Array<User>>} - Array of User objects representing all users in the database.
     */
    async getAllUsers() {
        const [rows] = await this.pool.query('SELECT * FROM users');
        return rows.map(User.fromRow);
    }

    /**
     * Retrieves a user by their ID.
     * @async
     * @param {number} id - The ID of the user to retrieve.
     * @returns {Promise<User|null>} - User object if found, or null if no user with the specified ID exists.
     */
    async getUserById(id) {
        const [rows] = await this.pool.query('SELECT * FROM users WHERE user_id = ?', [id]);
        return rows.length ? User.fromRow(rows[0]) : null;
    }

    /**
     * Creates a new user in the database.
     * @async
     * @param {Object} userData - Data for the new user, containing `name`, `email`, and `password`.
     * @param {string} userData.name - The name of the user.
     * @param {string} userData.email - The email of the user.
     * @param {string} userData.password - The password of the user.
     * @returns {Promise<Object>} - Object with `id`, `name`, `email`, and `password` of the newly created user.
     * @throws {Error} - Throws an error if the user already exists.
     */
    async createUser(userData) {
        const { name, email, password } = userData;

        const existingUser = await this.findUserByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await this.pool.query(
            'INSERT INTO users (name, email, password, created_at, updated_at, role_id) VALUES (?, ?, ?, NOW(), NOW(), 2)',
            [name, email, hashedPassword]
        );

        return { id: result.insertId, name, email };
    }

    /**
     * Finds a user by email in the database.
     * @async
     * @param {string} email - The email of the user to search for.
     * @returns {Promise<Object|null>} - Returns the user object if found, otherwise null.
     */
    async findUserByEmail(email) {
        const [rows] = await this.pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows.length ? rows[0] : null;
    }

    /**
     * Validates a user's password during login.
     * @async
     * @param {string} email - The email of the user.
     * @param {string} password - The password provided for validation.
     * @returns {Promise<User|null>} - Returns the user object if credentials are valid, otherwise null.
     */
    async validateUser(email, password) {
        const user = await this.findUserByEmail(email);
        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        return isPasswordValid ? User.fromRow(user) : null;
    }

    /**
     * Updates an existing user's data.
     * @async
     * @param {number} id - The ID of the user to update.
     * @param {Object} userData - New data for the user, containing `name`, `email`, and `password`.
     * @param {string} userData.name - The new name of the user.
     * @param {string} userData.email - The new email of the user.
     * @param {string} userData.password - The new password of the user.
     * @returns {Promise<boolean>} - `true` if the user was updated, `false` otherwise.
     */
    async updateUser(id, userData) {
        const { name, email, password } = userData;

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await this.pool.query(
            'UPDATE users SET name = ?, email = ?, password = ?, updated_at = NOW() WHERE user_id = ?',
            [name, email, hashedPassword, id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Deletes a user from the database by their ID.
     * @async
     * @param {number} id - The ID of the user to delete.
     * @returns {Promise<boolean>} - `true` if the user was deleted, `false` otherwise.
     */
    async deleteUser(id) {
        const [result] = await this.pool.query('DELETE FROM users WHERE user_id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new UserService();
