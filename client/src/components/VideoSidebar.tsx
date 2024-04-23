import React from 'react';

function imgUrl(id: string)
{
  return `https://img.youtube.com/vi/${id}/default.jpg`
}

export interface VideoInfo
{
    title: string,
    id: string,
    channel: string,
    publishedDate: string | undefined
};

interface VideoEntryProps
{
  video: VideoInfo,
  onClick: () => void;
};

const VideoEntry: React.FC<VideoEntryProps> = ({ video, onClick }) =>
{

  return (
    <div className="w-full h-[100px] flex" title={video.channel + ":\n" + video.title} onClick={onClick}>
      <div className="flex h-full w-3/8">
        <img className="w-full h-full" src={imgUrl(video.id)}/>
      </div>
      <div className="flex flex-col w-1/2 h-full py-2 px-1 items-center flex-grow">
        <p className="text-ellipsis overflow-hidden whitespace-normal flex-grow text-xs font-extrabold text-white">{video.title}</p>
        {/* <div className="w-full h-[2px] bg-white"></div> */}
        <p className="overflow-hidden whitespace-normal flex-grow text-xs text-white">{video.channel}</p>
      </div>
    </div>
  )
}

interface VideoSidebarProps
{
    videos: VideoInfo[],
    sidebarState: string,
    listState: string,
    onVideoClick: (video: VideoInfo) => void,
    onRefresh: () => void;
};

export const VideoSidebar: React.FC<VideoSidebarProps> = ({videos, sidebarState, listState, onVideoClick, onRefresh}) =>
{

  return (
    <>
      {sidebarState === "transcript" && <div id="transcript-div"></div>}
      {sidebarState === "videos" &&
        <div id="video-list" className="h-full w-full flex flex-col overflow-auto">
          <div className="bg-white h-1/6 w-full flex justify-center items-center">
            <h3 className="px-4 font-bold text-xl">Other Videos</h3>
            <button className="flex items-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-80"
                    onClick={onRefresh}>
              <svg className="w-5 h-5 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span className="mx-1">Refresh</span>
            </button>
          </div>
          <div className="w-full h-full">
            {videos.map((video: VideoInfo) => (
              // !(videos.map(v => v.id).includes(video.id)) && 
              <VideoEntry key={video.id} video={video} onClick={() => onVideoClick(video)}/>
            ))}
            {listState === "refreshing" && "Fill With refresh"}
            {listState === "empty" && <p>No Videos To Display</p>}
            {listState === "error" && <p>Error Displaying Videos</p>}
          </div>
      </div>}
    </>
  )
}