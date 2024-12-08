const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

/**
 * Controller class for handling user-related API requests.
 * Manages HTTP request handling for user operations such as retrieving,
 * creating, updating, and deleting users.
 */
class UserController {

    /**
     * Retrieves all users.
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Retrieves a user by ID.
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getUserById(req, res) {
        try {
            const userId = parseInt(req.params.user_id, 10);
            const user = await userService.getUserById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Creates a new user.
     * @async
     * @param {Object} req - Express request object containing `name`, `email`, and `password`.
     * @param {Object} res - Express response object.
     */
    async createUser(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Name, email, and password are required' });
            }

            const existingUser = await userService.findUserByEmail(email);
            if (existingUser) {
                return res.status(409).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await userService.createUser({ name, email, password: hashedPassword });
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Logs in a user and generates a JWT token.
     * @async
     * @param {Object} req - Express request object containing `email` and `password`.
     * @param {Object} res - Express response object.
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const user = await userService.findUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Updates an existing user by ID.
     * @async
     * @param {Object} req - Express request object containing `user_id` in params and `name`, `email`,
     * and `password` in the body.
     * @param {Object} res - Express response object.
     */
    async updateUser(req, res) {
        try {
            const userId = parseInt(req.params.user_id, 10);
            const { name, email, password } = req.body;

            /*if (!name || !email ) {
                return res.status(400).json({ message: 'Name and email are required' });
            } */

            const hashedPassword = await bcrypt.hash(password, 10);

            const isUpdated = await userService.updateUser(userId, { name, email, password: hashedPassword });
           /* if (!isUpdated) {
                return res.status(404).json({ message: 'User not found or no changes made' });
            }

            res.json({ message: 'User updated successfully!' });
            */
           res.redirect('/admin');
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Deletes a user by ID.
     * @async
     * @param {Object} req - Express request object containing `user_id` in params.
     * @param {Object} res - Express response object.
     */
    async deleteUser(req, res) {
        try {
            const userId = parseInt(req.params.user_id, 10);
            const isDeleted = await userService.deleteUser(userId);

            if (!isDeleted) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.redirect('/admin');

            // res.json({ message: 'User deleted successfully!' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to edit users info from the admin portal.
     */
    async editForm(req, res) {
        try {
          const id = parseInt(req.params.user_id, 10);
          const users = await userService.getUserById(id);
          res.render('editusers', {users: users});
        } catch (error) {
          console.error('Error updating user:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }
}

module.exports = new UserController();
