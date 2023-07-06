const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");
const Video = require("../models/Video.model");
const mongoose = require("mongoose");

//Get
router.get("/signup", (req, res) => res.render("signup"));

//get userprofile
router.get("/userProfile", (req, res) => {
  const { currentUser } = req.session;
  console.log(currentUser);
  const userId = currentUser._id;
  User.findById(userId)
    .populate("videos")
    .then((user) => {
      const videos = user.videos;
      console.log("there are my videos: " + videos);
      res.render("users/user-profile", { videos, userInSession: currentUser });
    })
    .catch((error) => {
      console.error("Error retrieving user videos:", error);
      res.status(500).send("An error occurred");
    });
});

//get login
router.get("/login", (req, res) => res.render("login"));

//postlogin
router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { email, password } = req.body;

  if (email === "" || password === "") {
    req.session.userId = userId;
    res.render("login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        console.log("Email not registered. ");
        res.render("login", {
          errorMessage: "User not found and/or incorrect password.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        // when we introduce session, the following line gets replaced with what follows:
        // res.render('users/user-profile', { user });

        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        console.log("Incorrect password.");
        res.render("login", {
          errorMessage: "User not found and/or incorrect password.",
        });
      }
    })
    .catch((error) => next(error));
});
//post firstName and lastName
router.post("/signup", (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // make sure users fill all mandatory fields:
  if (!firstName || !lastName || !email || !password) {
    res.render("signup", {
      errorMessage:
        "All fields are mandatory. Please provide your firstName and lastName, email and password.",
    });
    return;
  }
  //pass
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        // firstName and lastName: firstName and lastName
        firstName,
        lastName,
        email,
        // passwordHash => this is the key from the User model
        //     ^
        //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      // console.log('Newly created user is: ', userFromDB);
      req.session.currentUser = userFromDB;
      res.redirect("/userProfile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        console.log(
          " firstName and lastName and email need to be unique. Either firstName and lastName or email is already used. "
        );

        res.status(500).render("signup", {
          errorMessage: "User not found and/or incorrect password.",
        });
      } else {
        next(error);
      }
    }); // close .catch()
});

//post logout
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

// POST route to delete a specific user's videos from the database
// router.post("/videos/:videoId", (req, res, next) => {
//   const { videoId } = req.params;

//   Video.findByIdAndDelete(videoId)
//     .then(() => {
//       // Video successfully deleted
//       res.redirect("/deletevideo");
//     })
//     .catch((error) => next(error));
// });

router.post("/deletevideo/:videoId", (req, res, next) => {
  const { videoId } = req.params;
  const userId = req.session.currentUser._id;
  User.findByIdAndUpdate(userId, {
    $pull: { videos: videoId },
  }).then((resp) => {
    console.log(resp);
    res.redirect("/courses");
  });

  // Video.findByIdAndDelete(videoId)
  //   .then(() => {
  //     // Video successfully deleted
  //     res.redirect("/userProfile");
  //   })
  //   .catch((error) => next(error));
});

router.get("/mylist", (req, res) => {});

module.exports = router;
