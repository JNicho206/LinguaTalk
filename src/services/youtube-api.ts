const axios = require('axios');


const API_KEY = process.env["YOUTUBE-API-KEY"];


class SearchResult
{
  videos: Array<any>;

  constructor(data: any)
  {
    this.videos = [];

    for (const item of data.items)
    {
      if (itemIsVideo(item))
      {
        this.videos.push(item);
      }
    }
  }

  getVideoIds()
  {
    let ids = [];
    for (const v of this.videos)
    {
      ids.push(v.id.videoId);
    }
  }
}

async function search(query: string, maxResults: number = 10, api_key: string | undefined = API_KEY)
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
    return new SearchResult(result.data);
  } catch (error)
  {
    console.error("Error hitting YouTube API search endpoint.", error);
    throw error;
  }
 
}

function itemIsVideo(item: any)
{
  return item.id.kind == "youtube#video";
}

module.exports = {search};