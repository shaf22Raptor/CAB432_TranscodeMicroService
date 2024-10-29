import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoUpload from './pages/VideoUpload';
import VideoPlayer from './pages/VideoPlayerPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/*Defining routes of website here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/video-upload/:email" element={<VideoUpload />} />
          <Route path="/video-player/:videoFileName" element={<VideoPlayer />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;