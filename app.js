// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

const session = require("express-session");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const path = require("path");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// Specify the directory where the static files are located
const publicDirectoryPath = path.join(__dirname, "public");
const distDirectoryPath = path.join(publicDirectoryPath, "dist");

// Serve static files from the public directory
app.use(express.static(publicDirectoryPath));

// Serve static files from the dist directory
app.use("/dist", express.static(distDirectoryPath));

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
/////////
require("./config/session.config")(app);
// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "ironclass2";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

function isAuthenticated(req, res, next) {
  if (req.session.currentUser) {
    res.locals.userInSession = req.session.currentUser; // Add user data to response locals
    next();
  } else {
    res.locals.userInSession = null; // If not logged in, set it to null
    next();
  }
}

// Use the middleware for all routes
app.use(isAuthenticated);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
const apiRoutes = require("./routes/youtube.api.routes");
app.use("/", indexRoutes);
app.use("/", apiRoutes);

const authRouter = require("./routes/auth.routes"); // <== has to be added
app.use("/", authRouter);
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
