import React, { useState } from 'react';
import TopicCard from '../components/TopicCard';


interface Topic {
  header: string,
  body: string,
  link?: string
}

interface Topics {
  [key: string]: Topic
}

const ReviewPage: React.FC = () => {
  const [reviewState, setReviewState] = useState("");

  const handleTopicClick = (event: any) =>
  {
    const topic = event.target.key;
    setReviewState(topic);
  };

  const topics: Topics = {
    "common-words": {
      header: "Review Common Words",
      body: "Review and practice the 2000 most common spanish words.",
      link: "http://frequencylists.blogspot.com/2015/12/the-2000-most-frequently-used-spanish.html"
    },
    "common-verbs": {
      header: "Review Common Verbs",
      body: "Review and practice the 200 most common verbs and their conjugations.",
      link: ""
    },
    "saved-terms": {
      header: "Personalized Review",
      body: "Review and practice the terms you've saved from your learning sessions.",
      link: ""
    }
  }

  return (
    <div className="flex justify-center items-center h-full w-full">
      {reviewState === "" && (
        <div id="reviewTopics" className="flex h-auto w-full justify-center items-center gap-4">
          {Object.keys(topics).map((topic: string) => (
            <TopicCard key={topic} header={topics[topic].header} body={topics[topic].body} link={topics[topic].link} onClick={handleTopicClick}/>
          ))}
        </div>
      )}
      {reviewState !== "" && (
        <div className="w-[1700px] h-[900px] m-24 flex flex-col bg-gray-600 rounded-lg">
          <div id="head" className="flex justify-center items-center h-1/6 w-full">
              <h1 className="text-4xl font-bold text-black">{topics[reviewState].header}</h1>
          </div>
          <div>
            <div id="term" className="flex w-full h-full ">

            </div>
            <div id="divider" className="h-full w-1 bg-black"/>
            <div id="translation">

            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default ReviewPage;