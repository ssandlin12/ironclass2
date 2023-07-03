/** @format */

const app = require("../app");
const axios = require("axios");
const { Router } = require("express");
const { youtube } = require("googleapis/build/src/apis/youtube");
const routerOne = new Router();

class ApiService {
  constructor(apiKey) {
    this.api = axios.create({
      baseURL: "https://www.googleapis.com/youtube/v3",
      params: {
        key: apiKey,
      },
    });
  }

  searchVideos = (query, maxResults) => {
    return this.api.get("/search", {
      params: {
        q: query,
        maxResults: maxResults,
        part: "snippet",
        type: "video",
      },
    });
  };

  loadVideoById = (videoId) => {
    return this.api.get("/videos", {
      params: {
        id: videoId,
        //startSeconds: startSeconds,
        // endSeconds: endSeconds,
        part: "snippet",
        type: "video",
      },
    });
  };
}

module.exports = ApiService;
