const express = require('express'); 
const userController = require('../controllers/userController');
const { validateUser, validateUserId } = require('../validators/userDTO');
const authenticateToken = require('../authMiddleware'); 

const router = express.Router();

/**
 * @description Retrieve all users from the database.
 * @route GET /users
 * @access Protected (requires a valid token)
 */
router.get('/', authenticateToken, userController.getAllUsers); 

/**
 * @description Retrieve a specific user by their `user_id`.
 * @route GET /users/:user_id
 * @param {number} user_id - The ID of the user to retrieve.
 * @access Protected (requires a valid token)
 */
router.get('/:user_id', [authenticateToken, validateUserId], userController.getUserById); 

/**
 * @description Create a new user (registration).
 * @route POST /users
 * @body {string} name - The name of the user.
 * @body {string} email - The email of the user.
 * @body {string} password - The password of the user.
 * @access Public
 */
router.post('/', validateUser, userController.createUser);

/**
 * @description Update an existing user by their `user_id`.
 * @route PUT /users/:user_id
 * @param {number} user_id - The ID of the user to update.
 * @body {string} [name] - The new name of the user.
 * @body {string} [email] - The new email of the user.
 * @body {string} [password] - The new password of the user.
 * @access Protected (requires a valid token)
 */
router.post('/update-user/:user_id', [validateUserId, validateUser], userController.updateUser);
 
/**
 * @description Delete a user by their `user_id`.
 * @route DELETE /users/:user_id
 * @param {number} user_id - The ID of the user to delete.  
 * @access Protected (requires a valid token)
 */
router.delete('/:user_id', [authenticateToken, validateUserId], userController.deleteUser);

/**
 * @description Render the edit form for a specific user by their `user_id`.
 * @route GET /users/edit-form/:user_id
 * @param {number} user_id - The ID of the user to edit.
 * @access Protected (requires a valid token)
 */
router.get('/edit-form/:user_id', validateUserId, (req, res) => userController.editForm(req, res)); 

module.exports = router;
