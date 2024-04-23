import React, { useState } from "react";
import { VideoSidebar, VideoInfo } from "../components/VideoSidebar";

function idToUrl(id: string)
{
  return `https://www.youtube.com/embed/${id}`;
}

interface TermData
{
  term: string,
  familiarity: number
};

interface TermFormProps
{
  data: TermData,
  onTermChange: (event: any) => void;
  onFamiliarityChange: (event: any) => void;
  onSubmit: (event: any) => void;
}

const TermForm: React.FC<TermFormProps> = ({data, onTermChange, onFamiliarityChange, onSubmit}) => {

  return (
    <div className="flex justify-center items-center h-full w-full gap-5">
      <form className="flex" onSubmit={onSubmit}>
        <input
          type="text"
          className="block border-0 rounded-md text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 h-25px w-300px"
          placeholder="Enter Vocab Word or Phrase"
          required
          onChange={onTermChange}
        />
        {data.term && (
          <select id="vocab-familiarity-select" required onChange={onFamiliarityChange}
            className="block h-25px w-125px rounded-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600">
            <option value={0} selected={true} disabled={true}>
              Familiarity
            </option>
            <option value={1}>First Encounter</option>
            <option value={2}>Vaguely Familiar</option>
            <option value={3}>Familiar</option>
            <option value={4}>Confident</option>
            <option value={5}>Concrete</option>
          </select>
        )}
        {data.term && data.familiarity && (
          <button type="submit" id="vocab-term-save" disabled={true} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            Save Term
          </button>
        )}
      </form>
    </div>
  );
};

const ListenPage: React.FC = () => {
  
  const [formData, setFormData] = useState<TermData>({term: "", familiarity: 1});
  const [currentVideo, setCurrentVideo] = useState<VideoInfo | null>(null);
  const [sidebarVideos, setSidebarVideos] = useState<VideoInfo[]>([]);
  const [sidebarState, setSidebarState] = useState("videos");
  const [listState, setListState] = useState("empty");

  const handleTermChange = (event: any) => {
    setFormData({
      ...formData,
      term: event.target.value
    });
  };

  const handleFamiliarityChange = (event: any) => {
    setFormData({
      ...formData,
      familiarity: event.target.value
    })
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    fetch("/save-term", {
      method: "POST",
      body: JSON.stringify(formData)
    })
    .then((response: Response) =>
    {
      if (!response.ok)
      {
        throw new Error("Error saving the term.");
      }
      setFormData({term: "", familiarity: 0})
    })
    .catch((error: Error) => 
    {
      console.error(error);
      alert(error);
    });
  };

  const handleSidebarVideoClick = (clicked: any) => {
    setSidebarVideos(prevVideos => prevVideos.filter(video => video.id !== clicked.id));
    setCurrentVideo(clicked);
  };

  const handleRefresh = () =>
  {
    setSidebarState("videos");
    setSidebarVideos([])
    setListState("refreshing");
    fetch("http://127.0.0.1:3000/api/get-youtube-videos?n=5", {
      method: "GET"
    })
    .then((response: Response) => {
      if (!response.ok)
      {
        throw new Error("Error getting youtube videos")
      }
      return response.json()
    })
    .then(newVideos => {
      console.log(newVideos);
      setSidebarVideos(newVideos);
      console.log(sidebarVideos);
      setListState("populated");
    })
    .catch((error: Error) =>
    {
      console.error(error);
      setListState("error");
    });
  }

  return (
    <>
      <title>Practice Listening</title>
      <div className="w-[1700px] h-[900px] m-24 flex flex-col bg-teal-600 rounded-lg">
        <div id="head" className="flex justify-center items-center h-1/6 w-full">
          <h1 className="text-4xl font-bold text-black">Practice Listening!</h1>
        </div>
        <div id="body" className="flex flex-col h-full w-full">
          <div className="flex w-full h-5/6">
            <div className="flex h-full w-3/4">
              {currentVideo && <iframe
                className="w-full h-full"
                src={idToUrl(currentVideo.id)}
              />}
            </div>
            <div className="h-full w-1/4">
              <VideoSidebar videos={sidebarVideos} listState={listState} sidebarState={sidebarState} onRefresh={handleRefresh} onVideoClick={handleSidebarVideoClick} />
            </div>
          </div>
          <div className="flex w-full h-[50px]">
            <TermForm data={formData} onTermChange={handleTermChange} onFamiliarityChange={handleFamiliarityChange} onSubmit={handleSubmit}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListenPage;
