import React from "react";
import YouTube from 'react-youtube';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export default function VideoPlayerPanel({ videoID, youtubeID }) {

    if (videoID) {
        const vidSource = `${apiBaseUrl}/video/stream-video/${videoID}`;
        return (
            <div className="video-area">
                <video controls>
                    <source src={vidSource} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        )
    };

    if (youtubeID) {
        const opts = {
            playerVars: {
                autoplay: 0, // Set to 1 to autoplay
            },
        };

        return (
            <div className="youtube-player">
                <YouTube videoId={youtubeID} opts={opts} />
            </div>
        );
    }
};
