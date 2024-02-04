const dotenv = require("dotenv").config();
const axios = require('axios');


const API_KEY = process.env["YOUTUBE-API-KEY"];


async function search(query, maxResults = 10, api_key = API_KEY)
{
  let data = '';
  const endpoint = 'https://www.googleapis.com/youtube/v3/search?part=snippet';

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: endpoint,
    headers: { 
      key: api_key
    },
    data: data,
    params: {
      part: "snippet",
      q: query,
      maxResults: maxResults
    }
  };

  try
  {
    let result = await axios.request(config);
    return result.data;
  } catch (error)
  {
    console.error("Error hitting YouTube API search endpoint.", error);
    throw error;
  }
 
}

module.exports = {search};