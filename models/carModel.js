/**
 * Car model representing a car's details.
 * This model is used to define the structure of a car and 
 * handle instantiation and conversion of data from database rows.
 */
class Car {
    /**
     * Creates an instance of the Car class.
     * @constructor
     * @param {number} car_id - The unique identifier for the car.
     * @param {string} model - The model name of the car.
     * @param {string} brand - The brand name of the car.
     * @param {number} top_speed - The top speed of the car (in km/h).
     * @param {number} horsepower - The horsepower of the car's engine.
     * @param {string} price - The price of the car (as a string, formatted with currency).
     * @param {string} images - The filename or URL of the car's image.
     */
    constructor(car_id, model, brand, top_speed, horsepower, price, images) {
        this.car_id = car_id;
        this.model = model;
        this.brand = brand;
        this.top_speed = top_speed;
        this.horsepower = horsepower;
        this.price = price;
        this.images = images; // updated to "image" for the image property
    }

    /**
     * Converts a database row into a Car instance.
     * @static
     * @param {Object} row - The database row representing a car's details.
     * @param {number} row.car_id - The unique identifier for the car.
     * @param {string} row.model - The model name of the car.
     * @param {string} row.brand - The brand name of the car.
     * @param {number} row.top_speed - The top speed of the car (in km/h).
     * @param {number} row.horsepower - The horsepower of the car's engine.
     * @param {string} row.price - The price of the car (as a string, formatted with currency).
     * @param {string} row.images - The filename or URL of the car's image.
     * @returns {Car} A new instance of the Car class.
     */
    static fromRow(row) {
        return new Car(
            row.car_id,
            row.model,
            row.brand,
            row.top_speed,
            row.horsepower,
            row.price,
            row.images // using "image" instead of "image_filename"
        );
    }
}

module.exports = Car;
