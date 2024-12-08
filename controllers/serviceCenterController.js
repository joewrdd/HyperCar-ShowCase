const serviceCenterService = require('../services/serviceCenterService');

/**
 * Controller class for handling service center-related API requests.
 * Manages HTTP request handling for service center operations such as retrieving,
 * creating, updating, deleting, and searching service centers.
 */
class ServiceCenterController {

    /**
     * Handles the request to retrieve all service centers.
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getAllServiceCenters(req, res) {
        try {
            const serviceCenters = await serviceCenterService.getAllServiceCenters();
            res.render('servicecenterdetails', { serviceCenters }); // will be accessible in your EJS template
            // res.json(serviceCenters);
        } catch (error) {
            console.error('Error fetching service centers:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to retrieve a service center by ID.
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getServiceCenterById(req, res) {
        try {
            const id = parseInt(req.params.service_cent_id, 10);
            const serviceCenter = await serviceCenterService.getServiceCenterById(id);
            if (!serviceCenter) {
                return res.status(404).json({ message: 'Service center not found' });
            }
            res.json(serviceCenter);
        } catch (error) {
            console.error('Error fetching service center:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to create a new service center.
     * @async
     * @param {Object} req - Express request object containing `name`, `location`, `contact_nb`,
     * `manufacturer_id`, and `services_offered`.
     * @param {Object} res - Express response object.
     */
    async createServiceCenter(req, res) {
        try {
            const { name, location, contact_nb, manufacturer_id, services_offered } = req.body;
            if (!name || !location || !contact_nb || !manufacturer_id || !services_offered) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            const newServiceCenter = await serviceCenterService.createServiceCenter({
                name,
                location,
                contact_nb,
                manufacturer_id,
                services_offered
            });
            res.status(201).json(newServiceCenter);
        } catch (error) {
            console.error('Error creating service center:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to update an existing service center by ID.
     * @async
     * @param {Object} req - Express request object containing `service_cent_id` in params and `name`,
     * `location`, `contact_nb`, `manufacturer_id`, and `services_offered` in the body.
     * @param {Object} res - Express response object.
     */
    async updateServiceCenter(req, res) {
        try {
            const id = parseInt(req.params.service_cent_id, 10);
            const { name, location, contact_nb, manufacturer_id, services_offered } = req.body;
           /* if (!name || !location || !contact_nb || !manufacturer_id || !services_offered) {
                return res.status(400).json({ message: 'All fields are required' });
            } */
            const success = await serviceCenterService.updateServiceCenter(id, {
                name,
                location,
                contact_nb,
                manufacturer_id,
                services_offered
            });
           /* if (!success) {
                return res.status(404).json({ message: 'Service center not found or changes not made' });
            }
            res.json({ message: 'Service center updated successfully!' });*/
            res.redirect('/admin');
        } catch (error) {
            console.error('Error updating service center:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to delete a service center by ID.
     * @async
     * @param {Object} req - Express request object containing `service_cent_id` in params.
     * @param {Object} res - Express response object.
     */
    async deleteServiceCenter(req, res) {
        try {
            const id = parseInt(req.params.service_cent_id, 10);
            const success = await serviceCenterService.deleteServiceCenter(id);
            if (!success) {
                return res.status(404).json({ message: 'Service center not found' });
            }
            res.redirect('/admin');
            // res.json({ message: 'Service center deleted successfully!' });
        } catch (error) {
            console.error('Error deleting service center:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to edit service centers from the admin portal.
     */
    async editForm(req, res) {
        try {
          const id = parseInt(req.params.service_cent_id, 10);
          const service_centers = await serviceCenterService.getServiceCenterById(id);
          res.render('editservicecenters', {service_centers: service_centers});
        } catch (error) {
          console.error('Error updating service center:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }
}

module.exports = new ServiceCenterController();
