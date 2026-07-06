import React, { useEffect, useState } from "react";
import { dummyStoriesData } from "../assets/assets";
import { Plus } from "lucide-react";
import moment from "moment";
import StoryModel from "./StoryModel";

const StoriesBar = () => {
  const [stories, setStories] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [ viewStory, setViewStory ] = useState(null);

  const fetchStories = async () => {
    setStories(dummyStoriesData);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl overflow-x-auto no-scrollbar px-4">
      <div className="flex gap-4 pb-5">
        {/* Create Story Card */}
        <div 
        onClick={() => setShowModel(true)}
        className="min-w-30 max-w-30 h-40 rounded-lg border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer">
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="size-10 rounded-full bg-indigo-500 flex items-center justify-center mb-3">
              <Plus className="w-5 h-5 text-white" />
            </div>

            <p className="text-sm font-medium text-slate-700">Create Story</p>
          </div>
        </div>

        {/* Story Cards */}
        {stories.map((story, index) => (
          <div
            key={index}
            className="relative min-w-30 max-w-30 h-40 rounded-lg overflow-hidden shadow cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95"
          >
            {/* Profile Image */}
            <img
              src={story.user.profile_picture}
              alt=""
              className="absolute top-3 left-3 size-8 rounded-full ring-2 ring-white shadow z-10"
            />

            {/* Story Content */}
            <p className="absolute top-14 left-3 right-3 text-sm text-white/70 font-medium line-clamp-2">
              {story.content}
            </p>

            {/* Time */}
            <p className="absolute bottom-2 right-2 text-[11px] text-white font-medium whitespace-nowrap">
              {moment(story.created_at).fromNow()}
            </p>
            {story.media_type !== "text" && (
              <div className="absolute inset-0 z-1 rounded-lg bg-black overflow-hidden">
                {story.media_type === "image" ? (
                  <img
                    src={story.media_url}
                    alt=""
                    className="w-full h-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80"
                  />
                ) : (
                  <video
                    src={story.media_url}
                    controls
                    className="w-full h-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Add story model */}
      {showModel && <StoryModel setShowModel={setShowModel} fetchStories={fetchStories} />}
    </div>
  );
};

export default StoriesBar;
