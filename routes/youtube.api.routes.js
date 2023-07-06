/** @format */

const apiService = require("../services/api.services");
const { Router } = require("express");
const router = new Router();

const key = process.env.YOUTUBE_API_KEY;
const Youtube = new apiService(key);


router.get("/courses", (req, res) => {
  if (!req.session.currentUser) {
    res.redirect("/locked-courses");
  }

  const searchQueries = [
    "Learn React With This One Project",
    "100+ JavaScript Concepts you Need to Know",
    "How to Code: Rectangular Collision Detection with JavaScript",
  ];

  Youtube.searchVideos(searchQueries, 1)
    .then((responses) => {
      const videos = responses.flatMap((response) => response.data.items);
      res.render("courses", { videos });
    })
    .catch((error) => {
      console.error("Error searching videos:", error);
      res.status(500).send(error);
    });
});

router.get("/courses/:videoId", (req, res) => {
  const { videoId } = req.params;

  const showThisVideo = Youtube.loadVideoById(videoId);

  showThisVideo
    .then((video) => {
      const myVideo = video.data.items[0].id;
      res.render("view-course", { myVideo });
    })

    .catch((error) => {
      console.error("Error displaying your video:", error);
      res.status(500).send(error);
    });
});

////////////////////////////////////Adding to favorites////////////////////////////////////////
const mongoose = require("mongoose");
const Video = require("../models/Video.model");
const User = require("../models/User.model");

router.post("/add-to-list", (req, res) => {
  const { videoId } = req.body;
  const { currentUser } = req.session;

  console.log("this is my userID:" + currentUser);
  console.log("this is my fav:" + videoId);

  const favVideo = Youtube.loadVideoById(videoId);

  favVideo
    .then((video) => {
      const myVideo = video.data.items[0];
      const newVideo = new Video({
        title: myVideo.snippet.title,
        videoId: myVideo.id,
        thumbnail: myVideo.snippet.thumbnails.high.url,
        userId: currentUser,
      });

      newVideo
        .save()

        .then(() => {
          Video.find().then((videos) => {
            console.log(videos);
            User.findByIdAndUpdate(currentUser, {
              $push: { videos: newVideo._id },
            }).then((videos) => {
              // console.log(videos);
              res.redirect("/courses");
            });
          });
        })

        .catch((error) => {
          console.error("Error saving the video:", error);
          res.status(500).send("An error occurred");
        });
    })

    .catch((error) => {
      console.error("Error adding your video to favs:", error);
      res.status(500).send("An error occurred");
    });
});

module.exports = router;
