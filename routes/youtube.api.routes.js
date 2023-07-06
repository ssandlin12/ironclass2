/** @format */

const apiService = require("../services/api.services");
const { Router } = require("express");
const router = new Router();

const key = process.env.YOUTUBE_API_KEY;
const Youtube = new apiService(key);
const Youtube1 = new apiService(key);
const Youtube2 = new apiService(key);




router.get("/courses", (req, res) => {
  if (!req.session.currentUser) {
    res.redirect("/locked-courses");
  }
  const searchThis = "Learn React With This One Project";
  const searchThis1 = "100+ JavaScript Concepts you Need to Know";
  const searchThis2 = "How to Code: Rectangular Collision Detection with JavaScript";

  const searchQueries = [
    "Learn React With This One Project",
    "100+ JavaScript Concepts you Need to Know",
    "How to Code: Rectangular Collision Detection with JavaScript",
  ];

  Promise.all([searchResult, searchResult1, searchResult2])
    .then((result) => {

        const video = result[0].data.items;
        const video2 = result[1].data.items;
        const video1 = result[2].data.items;

          //console.log(video1);
          //console.log(video2);

       res.render("courses", { video, video1, video2 });
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



    // User.find(currentUser)
    //   .then((res) => {
    //    return res.findOne(currentUser.videos);
    //   })

    // .then((myVideos) => {
    //  console.log("there are my videos: " + myVideos);
    //   })







    .catch((error) => {
      console.error("Error adding your video to favs:", error);
      res.status(500).send("An error occurred");
    });
});

module.exports = router;
