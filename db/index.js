const mongoose = require("mongoose");

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const dbUrl =
  "mongodb+srv://Ironclass2:WUa8SqDJxsplfxB1@cluster0.mbodwq0.mongodb.net/";

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(dbUrl, connectionParams)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Error:", error);
  });
