import React, { useEffect, useState } from "react";
import { VideoSidebar, VideoInfo } from "../components/VideoSidebar";

function idToUrl(id: string)
{
  return `https://www.youtube.com/embed/${id}`;
}

async function getVideos()
{
  const response = await fetch(`http://127.0.0.1:3000/api/get-youtube-videos?n=100`);
  if (!response.ok) throw new Error("Error getting youtube videos.");
  const videos = await response.json();
  return videos;
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
    <div className="flex justify-center items-center h-full w-full flex-grow">
      <form className="flex w-full justify-center gap-4 items-center" onSubmit={onSubmit}>
        <input
          type="text"
          value={data.term || ''}
          className="border-0 rounded-md text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 h-10 w-[300px]"
          placeholder="Enter Vocab Word or Phrase"
          required
          onChange={onTermChange}
        />
        {data.term && (
          <select defaultValue={0} id="vocab-familiarity-select" required onChange={onFamiliarityChange}
            className="block h-10 w-max rounded-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 mx-1.5">
            <option value={0} disabled={true}>
              Familiarity
            </option>
            <option value={1}>First Encounter</option>
            <option value={2}>Vaguely Familiar</option>
            <option value={3}>Familiar</option>
            <option value={4}>Confident</option>
            <option value={5}>Concrete</option>
          </select>
        )}
        {data.term && data.familiarity !== 0 && (
          <button type="submit" className="flex items-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-80">
            <span className="mx-1">Save Term</span>
          </button>
        )}
      </form>
    </div>
  );
};

const ListenPage: React.FC = () => {
  const nSidebarVideos: number = 5;
  const poolMin: number = 10;
  const [formData, setFormData] = useState<TermData>({term: "", familiarity: 0});
  const [videoPool, setVideoPool] = useState<VideoInfo[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoInfo | null>(null);
  const [sidebarVideos, setSidebarVideos] = useState<VideoInfo[]>([]);
  const [sidebarState, setSidebarState] = useState("videos");
  const [listState, setListState] = useState("empty");

  

  // On first render
  useEffect(() => {
    //Populate the video pool
    const setCurrentVideoAndSidebarVideos = (videos: VideoInfo[]) => {
      if (videos && videos.length > 0) {
        const updatedVideos = [...videos];
        const current = updatedVideos.pop() as VideoInfo;  // Remove the last video for current
        setCurrentVideo(current);
        setVideoPool(updatedVideos);          // Update video pool after removing the current video
        setSidebarVideos(updatedVideos.slice(0, 5));  // Set the sidebar videos
        setListState("populated");
      }
    };

    const setup = async () => {
      try {
        const videos = await getVideos();
        setVideoPool(videos);
    
        setCurrentVideoAndSidebarVideos(videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setListState("error");
      }
    }
    setup();
  }, []);

  useEffect(() => { 
    const handleChange = async () =>
    {
      if (videoPool.length < poolMin)
      {
        try {
          const videos = await getVideos();
          const ids = videoPool.map(v => v.id);
          setVideoPool((prevPool: VideoInfo[]) => [...prevPool, ...videos.filter((v: VideoInfo) => !(ids.includes(v.id)))])
        } catch (error) {
          console.error("Error getting videos: ", error);
        }
          if (videoPool.length < nSidebarVideos)
          {
            setListState("error");
            return;
          }
      }
      if (sidebarVideos.length < nSidebarVideos && videoPool.length > 0) {
        // Calculate how many more videos are needed to fill the sidebar.
        const neededVideos = nSidebarVideos - sidebarVideos.length;
        const newVideos = videoPool.slice(-neededVideos);  // Take the last 'neededVideos' from videoPool
        const remainingVideos = videoPool.slice(0, -neededVideos); // Remaining videos after taking out what's needed
    
        // Update the state atomically without looping
        setVideoPool(remainingVideos);
        setSidebarVideos((prevSidebarVideos) => [...prevSidebarVideos, ...newVideos]);
      }
      setListState("populated");
    }

    handleChange();
  }, [sidebarVideos, videoPool]);

  const handleTermChange = (event: any) => {
    if (event.target.value === "")
    {
      setFormData({term: "", familiarity: 0});
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      term: event.target.value
    }));
  };

  const handleFamiliarityChange = (event: any) => {
    setFormData((prevData) => ({
      ...prevData,
      familiarity: event.target.value
    }))
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    fetch("http://127.0.0.1:3000/api/save-vocab", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...formData, translation: "How are you?"})
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
    setSidebarVideos(sidebarVideos => sidebarVideos.filter(video => video.id !== clicked.id));
    setCurrentVideo(clicked);
  };

  const handleRefresh = () =>
  {
    setSidebarState("videos");
    setSidebarVideos([])
    setListState("refreshing");
  };
  return (
    <>
      <title>Practice Listening</title>
      <div className="w-[1700px] h-[900px] m-24 flex flex-col bg-gray-600 rounded-lg">
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
          <div className="flex w-full flex-grow">
            <TermForm data={formData} onTermChange={handleTermChange} onFamiliarityChange={handleFamiliarityChange} onSubmit={handleSubmit}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListenPage;
