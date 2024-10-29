import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import RecommendedVideos from "../YouTubeFeed.jsx";
import VideoPlayerPanel from "../VideoPlayer.jsx";

import '../App.css';

export default function VideoPlayer() {
  const { videoFileName } = useParams();
  const [youtubeID, setYouTubeID] = useState(null);

  const handleYouTubeVideoClick = (id) => {
    setYouTubeID(id);
  }

  // Layout for the videoplayer page, to play a selected video
  return (
    <div className="video-player">
      <div className="video-panel">
        {/* Check to see if the selected video is a video stored on local storage, or a YouTube video */}
        <VideoPlayerPanel videoID={!youtubeID ? videoFileName : null} youtubeID={youtubeID} />
        <Link to='/'>
          <button>
            Back
          </button>
        </Link>
      </div>
      {/* Render videos retrieved from YouTube API call */}
      <div className="recommended-videos">
        <RecommendedVideos videoID={videoFileName} onVideoClick={handleYouTubeVideoClick} />
      </div>
    </div>
  );
}