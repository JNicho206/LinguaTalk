import { stringify } from "querystring";

const axios = require('axios');


const API_KEY = process.env["YOUTUBE-API-KEY"] as string;

export class Video
{
  id: string;
  title: string;
  channel: string;
  publishDate: string;

  constructor(data: any)
  {
    this.id = data.id.videoId;
    this.title = data.snippet.title;
    this.channel = data.snippet.channelTitle;
    this.publishDate = data.snippet.publishedAt;
  }
};

export class SearchResult
{
  videos: Array<Video>;

  constructor(data: any)
  {
    this.videos = [];
    for (const item of data.items)
    {
      if (itemIsVideo(item))
      {
        const v = new Video(item);
        this.videos.push(v);
      }
    }
  }

  getVideoIds()
  {
    let ids = [];
    for (const v of this.videos)
    {
      ids.push(v.id);
    }
  }
}

export async function search(query: string, maxResults: number = 10, api_key: string = API_KEY)
{
  const endpoint = 'https://www.googleapis.com/youtube/v3/search?';
  const params = {
    part: "snippet",
    q: query,
    maxResults: String(maxResults),
    key: api_key
  }
  const query_params = new URLSearchParams(params).toString();
  
  const url = `${endpoint}${query_params}`;
  const result = await fetch(url, {
    method: "GET"
  });

  return new SearchResult(await result.json());
}

export function itemIsVideo(item: any)
{
  return item.id.kind == "youtube#video";
}
