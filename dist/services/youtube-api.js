"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios');
const API_KEY = process.env["YOUTUBE-API-KEY"];
class SearchResult {
    constructor(data) {
        this.videos = [];
        for (const item of data.items) {
            if (itemIsVideo(item)) {
                this.videos.push(item);
            }
        }
    }
    getVideoIds() {
        let ids = [];
        for (const v of this.videos) {
            ids.push(v.id.videoId);
        }
    }
}
function search(query, maxResults = 10, api_key = API_KEY) {
    return __awaiter(this, void 0, void 0, function* () {
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
        try {
            let result = yield axios.request(config);
            return new SearchResult(result.data);
        }
        catch (error) {
            console.error("Error hitting YouTube API search endpoint.", error);
            throw error;
        }
    });
}
function itemIsVideo(item) {
    return item.id.kind == "youtube#video";
}
module.exports = { search };
