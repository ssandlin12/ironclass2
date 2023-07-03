/** @format */


const apiService = require("../services/api.services");
const { Router } = require("express");
const routerOne = new Router();



const key = process.env.YOUTUBE_API_KEY;
const Youtube = new apiService(key);
const Youtube1 = new apiService(key);
const Youtube2 = new apiService(key);

routerOne.get("/courses", (req, res) => {

  const searchThis = "Learn React With This One Project";
  const searchThis1 = "100+ JavaScript Concepts you Need to Know";
  const searchThis2 = "How to Code: Rectangular Collision Detection with JavaScript";

  const searchResult = Youtube.searchVideos(searchThis, 1);
  const searchResult1 = Youtube1.searchVideos(searchThis1, 1);
  const searchResult2 = Youtube2.searchVideos(searchThis2, 1);

  Promise.all([searchResult, searchResult1, searchResult2])
    .then((result) => {

        const video = result[0].data.items;
        const video2 = result[1].data.items;
        const video1 = result[2].data.items;

          console.log(video1);
          console.log(video2);

       res.render("courses", { video, video1, video2 });
    })

  
    .catch((error) => {
      console.error("Error searching videos:", error);
      res.status(500).send("An error occurred");
    });
});




module.exports = routerOne;
