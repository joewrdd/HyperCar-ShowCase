const carService = require('../services/carService');
const path = require('path');

/**
 * Controller class for handling car-related API requests.
 * Manages HTTP request handling for operations such as retrieving,
 * creating, updating, and deleting car entries.
 */
class CarController {
    /**
     * Handles the request to retrieve all cars.
     */
    async getAllCars(req, res) {
        try {
            const cars = await carService.getAllCars();
             const carsWithImageUrl = cars.map(car => ({
                ...car,
                images: car.images ? `/images/${car.images}` : null,
            }));
            res.json(carsWithImageUrl);
        } catch (error) {
            console.error('Error fetching cars:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to retrieve a car by its ID.
     */
    async getCarById(req, res) {
        try {
            const id = parseInt(req.params.car_id, 10);
            if (!id) {
                return res.status(400).json({ message: 'Invalid car ID' });
            }
            const car = await carService.getCarById(id);
            if (!car) {
                return res.status(404).json({ message: 'Car not found' });
            }
            if (car.images) {
                car.images = `/images/${car.images}`;
            }
            res.json(car);
        } catch (error) {
            console.error('Error fetching car:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to create a new car.
     */
    async createCar(req, res) {
        try {
            const { model, brand, top_speed, horsepower, price, image } = req.body;

            if (!model || !brand || !top_speed || !horsepower || !price || !image) {
                return res.status(400).json({
                    message: 'All car details (model, brand, top speed, horsepower, price, image) are required'
                });
            }

            const newCar = await carService.createCar({ model, brand, top_speed, horsepower, price, image });
            res.status(201).json(newCar);
        } catch (error) {
            console.error('Error creating car:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to update an existing car.
     */
    async updateCar(req, res) {
        try {
            const id = parseInt(req.params.car_id, 10);
            const { model, brand, top_speed, horsepower, price, images } = req.body;

            /* if (!model || !brand || !top_speed || !horsepower || !price || !image) {
                return res.status(400).json({
                    message: 'All car details (model, brand, top speed, horsepower, price, image) are required'
                });
            } */

            const success = await carService.updateCar(id, { model, brand, top_speed, horsepower, price, images });
            /*if (!success) {
                return res.status(404).json({ message: 'Car not found or changes not made' });
            } 
            res.json({ message: 'Car updated successfully!' }); */
            res.redirect('/admin');
        } catch (error) {
            console.error('Error updating car:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to delete a car by its ID.
     */
    async deleteCar(req, res) {
        try {
            const id = parseInt(req.params.car_id, 10);
            const success = await carService.deleteCar(id);
            if (!success) {
                return res.status(404).json({ message: 'Car not found' });
            }
            res.redirect('/admin');
            // res.json({ message: 'Car deleted successfully!' });
        } catch (error) {
            console.error('Error deleting car:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to search for cars based on a query.
     */
    async searchCars(req, res) {
        const { query } = req.query;

        try {
            if (!query || !query.trim()) {
                return res.status(400).json({ message: 'Query parameter is required' });
            }

            const cars = await carService.searchCars(query);

            if (cars.length === 0) {
                return res.status(404).json({ message: 'No cars found' });
            }

            res.json(cars);
        } catch (error) {
            console.error('Error searching cars:', error);
            res.status(500).json({ message: 'Error searching cars', error: error.message });
        }
    }

    /**
     * Handles the request to edit cars from the admin portal.
     */
    async editForm(req, res) {
        try {
          const id = parseInt(req.params.car_id, 10);
          const car = await carService.getCarById(id);
          res.render('editcars', {car: car});
        } catch (error) {
          console.error('Error updating car:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }
}

module.exports = new CarController();
