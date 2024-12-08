    const express = require('express');
    const serviceCenterController = require('../controllers/serviceCenterController');
    const { validateServiceCenter, validateServiceCenterId } = require('../validators/serviceCenterDTO');

    const router = express.Router();

    /**
     * @description Retrieve all service centers from the database.
     * @route GET /service-centers
     * @access Public
     */
    router.get('/', (req, res) => serviceCenterController.getAllServiceCenters(req, res));

    /**
     * @description Retrieve a specific service center by its `service_cent_id`.
     * @route GET /service-centers/:service_cent_id
     * @param {number} service_cent_id - The ID of the service center to retrieve.
     * @access Public
     */
    router.get('/:service_cent_id', validateServiceCenterId, 
        (req, res) => serviceCenterController.getServiceCenterById(req, res));

    /**
     * @description Create a new service center.
     * @route POST /service-centers
     * @body {string} name - The name of the service center.
     * @body {string} location - The location of the service center.
     * @body {string} contact_nb - The contact number of the service center.
     * @body {number} manufacturer_id - The ID of the manufacturer associated with the service center.
     * @body {string} services_offered - The services offered by the service center.
     * @access Public
     */
    router.post('/', validateServiceCenter, (req, res) => serviceCenterController.createServiceCenter(req, res));

    /**
     * @description Update an existing service center by its `service_cent_id`.
     * @route PUT /service-centers/:service_cent_id
     * @param {number} service_cent_id - The ID of the service center to update.
     * @body {string} [name] - The new name of the service center.
     * @body {string} [location] - The new location of the service center.
     * @body {string} [contact_nb] - The new contact number of the service center.
     * @body {number} [manufacturer_id] - The new manufacturer ID associated with the service center.
     * @body {string} [services_offered] - The new services offered by the service center.
     * @access Public
     */
    router.post('/update-service-center/:service_cent_id', [validateServiceCenterId, validateServiceCenter],
        (req, res) => serviceCenterController.updateServiceCenter(req, res));

    /**
     * @description Delete a service center by its `service_cent_id`.
     * @route DELETE /service-centers/:service_cent_id
     * @param {number} service_cent_id - The ID of the service center to delete.
     * @access Public
     */
    router.delete('/:service_cent_id', validateServiceCenterId, 
        (req, res) => serviceCenterController.deleteServiceCenter(req, res));
    
    /**
    * @description Render the edit form for a specific service center by its `service_cent_id`.
    * @route GET /service-centers/edit-form/:service_cent_id
    * @param {number} service_cent_id - The ID of the service center to edit.
    * @access Public
    */
    router.get('/edit-form/:service_cent_id', validateServiceCenterId, (req, res) => serviceCenterController.editForm(req, res));


    module.exports = router;
