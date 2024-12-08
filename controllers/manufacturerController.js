const manufacturerService = require('../services/manufacturerService');
const carImageMapping = require('../config/carImageMapping');


/**
 * Controller class for handling manufacturer-related API requests.
 * Manages HTTP request handling for manufacturer operations such as retrieving,
 * creating, updating, and deleting manufacturers.
 */
class ManufacturerController {
    
    /**
     * Handles the request to retrieve all manufacturers.
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getAllManufacturers(req, res) {
        try {
            const manufacturers = await manufacturerService.getAllManufacturers();
            const carManufacturersWithImagePaths = manufacturers.map(manufacturer => {
                return {
                    ...manufacturer,
                    imagePath: `/images/${carImageMapping[manufacturer.name] || 'default.png'}` 
                };
            });
            res.render('manufacturerdetails', { manufacturers : carManufacturersWithImagePaths });
            // res.json(manufacturers);
        } catch (error) {
            console.error('Error fetching manufacturers:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to retrieve a manufacturer by ID.
     * @async
     * @param {Object} req - Express request object containing `manufacturer_id` in params.
     * @param {Object} res - Express response object.
     */
    async getManufacturerById(req, res) {
        try {
            const id = parseInt(req.params.manufacturer_id, 10);
            const manufacturer = await manufacturerService.getManufacturerById(id);
            if (!manufacturer) {
                return res.status(404).json({ message: 'Manufacturer not found' });
            }
            res.json(manufacturer);
        } catch (error) {
            console.error('Error fetching manufacturer:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to create a new manufacturer.
     * @async
     * @param {Object} req - Express request object containing `name`, `country`, and `founded_year` in the body.
     * @param {Object} res - Express response object.
     */
    async createManufacturer(req, res) {
        try {
            const { name, country, founded_year, images } = req.body;
            if (!name || !country || !founded_year) {
                return res.status(400).json({ message: 'Name, country, and founded year are required' });
            }
            const newManufacturer = await manufacturerService.createManufacturer({ name, country, founded_year, images });
            res.status(201).json(newManufacturer);
        } catch (error) {
            console.error('Error creating manufacturer:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to update an existing manufacturer.
     * @async
     * @param {Object} req - Express request object containing `manufacturer_id` in params and `name`,
     * `country`, and `founded_year` in the body.
     * @param {Object} res - Express response object.
     */
    async updateManufacturer(req, res) {
        try {
            const id = parseInt(req.params.manufacturer_id, 10);
            const { name, country, founded_year, images } = req.body;
            /*if (!name || !country || !founded_year) {
                return res.status(400).json({ message: 'Name, country, and founded year are required' });
            }*/
            const success = await manufacturerService.updateManufacturer(id, { name, country, founded_year, images });
            /*if (!success) {
                return res.status(404).json({ message: 'Manufacturer not found or changes not made' });
            }
            res.json({ message: 'Manufacturer updated successfully!' });*/
            res.redirect('/admin');
        } catch (error) {
            console.error('Error updating manufacturer:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to delete a manufacturer by ID.
     * @async
     * @param {Object} req - Express request object containing `manufacturer_id` in params.
     * @param {Object} res - Express response object.
     */
    async deleteManufacturer(req, res) {
        try {
            const id = parseInt(req.params.manufacturer_id, 10);
            const success = await manufacturerService.deleteManufacturer(id);
            if (!success) {
                return res.status(404).json({ message: 'Manufacturer not found' });
            }
            res.redirect('/admin');
            // res.json({ message: 'Manufacturer deleted successfully!' });
        } catch (error) {
            console.error('Error deleting manufacturer:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to edit manufacturers from the admin portal.
     */
    async editForm(req, res) {
        try {
          const id = parseInt(req.params.manufacturer_id, 10);
          const manufacturer = await manufacturerService.getManufacturerById(id);
          res.render('editmanufacturers', {manufacturer: manufacturer});
        } catch (error) {
          console.error('Error updating manufacturer:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }
}

module.exports = new ManufacturerController();
