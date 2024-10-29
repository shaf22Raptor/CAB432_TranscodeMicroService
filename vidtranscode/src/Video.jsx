import React from 'react';
import { Link } from 'react-router-dom';
import VideoInfo from './VideoClass';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
// Logic to render and show videos on main page using the videoID. video.fileName is reference to videoID in mySQL server
export default class Video extends React.Component {
    render() {
        const { video } = this.props;
        return (
            <div className='video-link'>
                <div className='video'>
                    <video width="240" height="142" controls>
                        {/* Endpoint where video will be streamed from */}
                        <source src={`${apiBaseUrl}/video/stream-video/${video.fileName}`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className='video-name'>
                    <Link to={`/video-player/${video.fileName}`}>{video.originalName}</Link>
                </div>
            </div>
        )
    }
}