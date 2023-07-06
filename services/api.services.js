const axios = require("axios");

class ApiService {
  constructor(apiKey) {
    this.api = axios.create({
      baseURL: "https://www.googleapis.com/youtube/v3",
      params: {
        key: apiKey,
      },
    });
  }

  searchVideos = (queries, maxResults) => {
    const requests = queries.map((query) => {
      return this.api.get("/search", {
        params: {
          q: query,
          maxResults: maxResults,
          part: "snippet",
          type: "video",
        },
      });
    });

    return axios.all(requests);
  };

  loadVideoById = (videoId) => {
    return this.api.get("/videos", {
      params: {
        id: videoId,
        part: "snippet",
        type: "video",
      },
    });
  };
}

module.exports = ApiService;
