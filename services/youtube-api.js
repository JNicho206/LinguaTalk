const dotenv = require("dotenv").config();
const axios = require('axios');


const api_key = process.env["YOUTUBE-API-KEY"];

let data = '';

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=spanish&maxResults=25&key=AIzaSyBoJNf05Ek50vzdCtckhRu5nPGmzoJu-TY',
  headers: { 
    'key': api_key
  },
  data: data,
  params: {
    part: "snippet",
    q: "How to spanish",
    maxResults: 25
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
