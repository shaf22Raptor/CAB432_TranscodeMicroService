import React, { useEffect, useState } from 'react';

// use YouTube API key to get related YouTube videos

// URL of Node server API
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

// get metadata for video that is on local server that has been selected
async function getMetaData(videoID) {
    const videoMetaDataEndpoint = `${apiBaseUrl}/video/video-details/${videoID}`;
    try {
        const response = await fetch(videoMetaDataEndpoint);
        if (!response.ok) {
            console.log("Failed to fetch metadata");
        }
        const data = await response.json();
        return data.data[0].originalName;
    } catch (err) {
        console.log("Error:", err.message);
        return null;
    }
}

// fetch related videos from YouTube
async function fetchVideos(videoName) {
    if (!videoName) return [];
    var cleanedName = videoName.replace(/\.[^/.]+$/, "").replace(/\d+/g, "").trim();
    const youTubeRequestEndpoint = `${apiBaseUrl}/video/youTubeFeed/${cleanedName}`;
    try {
        const response = await fetch(youTubeRequestEndpoint);
        if (!response.ok) {
            const errorData = await response.json();
            console.log("API error:", errorData);
            return [];
        }
        const data = await response.json();
        if (!data.success) {
            console.error("Error from API: ", data.message);
            return [];
        }
        return data;
    } catch (error) {
        console.error('Error fetching videos from YouTube:', error.message);
        return [];
    }
};

// Render the recommended YouTube videos on the page in an unordered list
function renderRecommendedVideos(videos, onVideoClick) {
    return (
        <ul className='youtube-videos'>
            {videos.map((video) => (
                <li key={video.id.videoId} onClick={() => onVideoClick(video.id.videoId)}>
                    <a href="#" onClick={(e) => e.preventDefault()}>
                        <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                        <p>{video.snippet.title}</p>
                    </a>
                </li>
            ))}
        </ul>
    );
}

export default function RecommendedVideos({ videoID, onVideoClick }) {
    const [videoName, setVideoName] = useState('');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getVideoName() {
            const name = await getMetaData(videoID);
            if (name) {
                setVideoName(name);
                console.log(name);
            }
        }
        getVideoName();
    }, [videoID]);

    useEffect(() => {
        if (videoName) {
            setLoading(true);
            fetchVideos(videoName)
                .then(response => {
                    if (response.success && Array.isArray(response.data)) {
                        console.log("response is", response.data);
                        setVideos(response.data); 
                    }       
                })
                .catch(() => {
                    console.log("error");
                })
                .finally(() => {
                    console.log("videos list",videos);
                    setLoading(false);
                });
        }
    }, [videoName]);
    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="recommended-videos">
            <h2>Related From YouTube</h2>
            {renderRecommendedVideos(videos, onVideoClick)}
        </div>
    );
}