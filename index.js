// Third Party Libraries Are Explained With Comments!!

const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const ejs = require("ejs");

/**
 * bcryptjs is used for hashing passwords and securely comparing hashed passwords during login.
 */
const bcrypt = require("bcryptjs");

/**
 * jsonwebtoken is used for generating and verifying JSON Web Tokens (JWT) for authentication.
 */
const jwt = require("jsonwebtoken");

/**
 * path is a utility module to handle and transform file paths.
 */
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const carRoutes = require("./routes/carRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");
const serviceCenterRoutes = require("./routes/serviceCenterRoutes");
const manufacturerRoutes = require("./routes/manufacturerRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userService = require("./services/userService");
const carService = require("./services/carService");
const serviceCenterService = require("./services/serviceCenterService");
const reviewService = require("./services/reviewService");
const manufacturerService = require("./services/manufacturerService");
const favoritesService = require("./services/favoritesService");

/**
 * carImageMapping maps car models to their corresponding image paths.
 */
const carImageMapping = require("./config/carImageMapping");

const { initDB } = require("./config/database");

/**
 * authenticateToken is middleware that verifies the authenticity of a JWT token in requests.
 */
const authenticateToken = require("./authMiddleware");

/**
 * cookieParser parses cookies attached to the incoming requests for easier handling.
 */
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Middleware to parse cookies from incoming requests.
 */
app.use(cookieParser());

/**
 * Middleware to serve static files (e.g., images, CSS, JS) from the 'public' directory.
 */
app.use(express.static("public"));

/**
 * Setting the view engine to 'ejs' for rendering dynamic HTML templates.
 */
app.set("view engine", "ejs");

/**
 * MethodOverride middleware allows us to use HTTP verbs like PUT and DELETE in forms.
 */
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

/**
 * Express session middleware for handling user sessions, including session data and JWT secret.
 */
const session = require("express-session");
app.use(
  session({
    secret: process.env.JWT_SECRET, // Secret used for signing session IDs
    resave: false, // Don't save session if it wasn't modified
    saveUninitialized: true, // Save a session even if it is new
  })
);

// Setting up routes with appropriate authentication middleware
// *** USERS AUTHENITCATE IS IN ROUTES FOLDER (just showing various ways to implement authenticateToken) ***

app.use("/users", userRoutes);
app.use("/reviews", authenticateToken, reviewRoutes);
app.use("/cars", authenticateToken, carRoutes);
app.use("/favorites", authenticateToken, favoritesRoutes);
app.use("/service_centers", authenticateToken, serviceCenterRoutes);
app.use("/manufacturers", authenticateToken, manufacturerRoutes);
app.use("/notifications", authenticateToken, notificationRoutes);

/**
 * Logs in the user by verifying the username/email and password.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post("/login", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const db = await initDB();
    const [users] = await db.query(
      "SELECT * FROM users WHERE name = ? OR email = ?",
      [name, email]
    );
    if (users.length === 0) {
      return res.status(400).json({ message: "Unregistered username" });
    }
    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid password" });
    const token = jwt.sign(
      { id: user.user_id, name: user.name, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.cookie("token", token); // Set the cookie (IMPORTANT FOR FUTURE PROJ)
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("An error occurred during login.");
  }
});

/**
 * Creates a new user and redirects to the home page.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post("/userssu", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await userService.createUser({ name, email, password });
    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser.id });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the user." });
  }
});

/**
 * Renders the admin page if the authenticated user has admin privileges.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/admin", authenticateToken, async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    const services = await serviceCenterService.getAllServiceCenters();
    const manufacturers = await manufacturerService.getAllManufacturers();
    const reviews = await reviewService.getAllReviews();
    const cars = await carService.getAllCars();
    const favorites = await favoritesService.getAllFavorites();
    const AuthenticatedUser = req.user;
    if (AuthenticatedUser && AuthenticatedUser.role_id == 1) {
      res.render("admin", {
        users,
        services,
        manufacturers,
        reviews,
        cars,
        favorites,
      });
    } else {
      res
        .status(403)
        .send("Only Admin Users Are Allowed To Access Admin Portal!");
    }
  } catch (err) {
    console.error("Error loading admin panel:", err);
    res
      .status(500)
      .send("An error occurred while trying to access the admin panel.");
  }
});

/**
 * Renders the signup page.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/signup", (req, res) => {
  res.render("signup");
});

/**
 * Renders the login page.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/login", (req, res) => {
  res.render("login");
});

/**
 * Logs out the user by clearing the authentication cookie.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

/**
 * Renders the about us page.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.use("/aboutus", authenticateToken, async (req, res) => {
  res.render("aboutus");
});

/**
 * Renders the dashboard page with car data and reviews for authenticated users.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    const cars = await carService.getAllCars();
    const reviews = await reviewService.getAllReviews();
    const isAuthenticated = req.user ? true : false;
    const carsWithImagePaths = cars.map((car) => {
      return {
        ...car,
        imagePath: `/images/${carImageMapping[car.model] || "default.jpg"}`,
      };
    });
    res.render("dashboard", {
      isAuthenticated: isAuthenticated,
      cars: carsWithImagePaths,
      reviews: reviews,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).send("An error occurred while fetching car data.");
  }
});

/**
 * Renders the home page and checks user authentication.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/home", authenticateToken, async (req, res) => {
  try {
    const cars = await carService.getAllCars();
    const isAuthenticated = req.user ? true : false;
    console.log("req.session?.user", req.user);
    if (isAuthenticated) {
      res.render("home", { isAuthenticated: isAuthenticated, cars });
    } else {
      res.redirect("login");
    }
  } catch (error) {
    console.error("Error fetching homepage:", error);
    res.status(500).send("An error occurred while fetching homepage.");
  }
});

/**
 * Renders the car comparison page with car data and images.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/carcomparison", authenticateToken, async (req, res) => {
  try {
    const cars = await carService.getAllCars();
    const carsWithImages = await Promise.all(
      cars.map(async (car) => {
        return {
          ...car,
          imagePath: `/images/${carImageMapping[car.model] || "default.jpg"}`,
        };
      })
    );
    res.render("carcomparison", {
      cars: carsWithImages,
      carImageMapping,
    });
  } catch (error) {
    console.error("Error fetching car comparison data:", error);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Renders the car comparison page with car data and images.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/userfavorites", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const cars = await carService.getAllCars();
    const favoriteCars = await favoritesService.getFavoritesByUser(user_id);
    const favoriteCarsWithImages = favoriteCars.map((favorite) => {
      const car = cars.find((car) => car.car_id === favorite.car_id);
      return {
        ...favorite,
        imagePath: car
          ? `/images/${carImageMapping[car.model] || "default.jpg"}`
          : "/images/default.jpg",
      };
    });
    res.render("userfavorites", { favoriteCars: favoriteCarsWithImages });
  } catch (error) {
    console.error("Error fetching favorite cars:", error);
    res.status(500).send("An error occurred while fetching favorite cars.");
  }
});

/**
 * Renders the car details page with information for a specific car.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/car/:id", authenticateToken, async (req, res) => {
  const carId = req.params.id;
  try {
    const database = await initDB();
    const [carResult] = await database.query(
      'SELECT *, CONCAT("/images/", images) AS images FROM cars WHERE car_id = ?',
      [carId]
    ); // To get car_id per image since i dont have images in my database from the start.
    const reviews = await reviewService.getReviewByCarId(carId);
    res.render("carDetails", {
      user: req.user,
      car: carResult[0],
      reviews: reviews || [],
    });
  } catch (err) {
    console.error("Error fetching car details:", err);
    res.status(500).send("An error occurred while fetching car details.");
  }
});

/**
 * Renders the settings page with information and linked account of the user.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/settings", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = req.user; // Assumes the user object contains name and email
    const favoriteCars = await favoritesService.getFavoritesByUser(userId); // Fetch user's favorite cars
    const favoriteCount = favoriteCars.length;
    const userProfilePicture = user.profilePicture
      ? `/images/${user.profilePicture}` // Assuming profilePicture stores the filename
      : "/images/default-avatar.jpg"; // Default avatar if no profile picture

    res.render("settings", { user, favoriteCount, userProfilePicture });
  } catch (error) {
    console.error("Error loading settings page:", error);
    res.status(500).send("An error occurred while loading settings.");
  }
});

/**
 * Renders the analytics page.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/analytics", authenticateToken, async (req, res) => {
  res.render("analyticsview");
});

/* app.get('/', (req, res) => {
        res.render('index', { isAuthenticated });
        res.send('Welcome to the User API');
    }); */

/**
 * Handles undefined routes by sending a 404 error.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found" });
});

/**
 * Handles unhandled errors by sending a 500 error.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

/**
 * Starts the Express server and listens for incoming requests on the specified port.
 * @async
 * @param {number} port - The port number on which the server will listen for requests.
 * @param {Function} callback - A callback function that will be invoked once the server starts successfully.
 */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
