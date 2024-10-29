import React, { useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import '../App.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

// Video File Input Component
function VideoFileInput({ onFileChange }) {
  return (
    <div>
      <label>Upload your video:</label>
      <input
        type="file"
        accept="video/*"
        onChange={onFileChange}
      />
    </div>
  );
}

// Upload Button Component
function UploadButton({ onSubmit }) {
  return (
    <button className="submit" type="submit" onClick={onSubmit}>Upload</button>
  );
}

// Upload Status Component
function UploadStatus({ status }) {
  return (
    <p>{status}</p>
  );
}

// Progress bar to show progress of uploading the video
function ProgressBar({ progress }) {
  return (
    <div className="progress-bar">
      <div className="progress" style={{ width: `${progress}%` }}>
        {progress}%
      </div>
    </div>
  );
}

// Main Video Upload Page Component with Cognito and S3 Upload
export default function VideoUploadPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const email = sessionStorage.getItem('email'); // Cognito-stored email
  
  // Get email from route parameters if needed
  const params = useParams();
  const finalEmail = email || params.email;

  const endpoint = `${apiBaseUrl}/video/${finalEmail}/upload-video`;

  // Handle file selection
  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  // Handle file upload submission
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setUploadStatus('Please select a video file.');
      return;
    }

    const formData = new FormData();
    formData.append('videoFile', videoFile);

    try {
      setUploadStatus('Uploading...');
      const xhr = new XMLHttpRequest();

      // Monitor upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded / event.total) * 100);
          setProgress(percentCompleted);
        }
      };

      // Call the endpoint for uploading video with Cognito authorization
      xhr.open('POST', endpoint, true);
      xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('idToken')}`); // Cognito token for authentication

      xhr.onload = () => {
        if (xhr.status === 200) {
          setUploadStatus('Video uploaded successfully!');
        } else {
          const errorData = JSON.parse(xhr.responseText);
          setUploadStatus(`Upload failed: ${errorData.message}`);
        }
      };

      xhr.onerror = () => {
        setUploadStatus('Upload failed due to a network error.');
      };

      xhr.send(formData);
    } catch (error) {
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div className='upload-page'>
      <h2>Upload a New Video</h2>
      <div className='upload-panel'>
        {/* File Input */}
        <VideoFileInput onFileChange={handleFileChange} />

        {/* Progress Bar */}
        <ProgressBar progress={progress} />

        {/* Upload Button */}
        {videoFile && (
          <UploadButton onSubmit={handleUpload} />
        )}

        {/* Display Upload Status */}
        <UploadStatus status={uploadStatus} />
        
        {/* Back Button */}
        <Link to='/'>
          <button className='home-button'>
            Back
          </button>
        </Link>
      </div>
    </div>
  );
}
