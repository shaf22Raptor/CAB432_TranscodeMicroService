const express = require('express');
const { transcodeVideo } = require('./transcode');  // Import the transcoding logic
const app = express();
const port = 5001;

// Middleware to parse JSON request bodies
app.use(express.json());

// Route to handle transcoding requests
app.post('/transcode', async (req, res) => {
  const Key  = req.body.s3Params.Key;
  console.log("service: transcode");

  if (!Key) {
    return res.status(400).json({ error: 'Video ID is required' });
  }

  try {
    // Set appropriate headers for video streaming
    // res.writeHead(200, {
    //   'Content-Type': 'video/mp4',
    //   'Content-Disposition': 'inline',
    //   'Accept-Ranges': 'bytes'
    // });

    // Call your streaming function here
    // Assume `transcodeStream` is a function that takes the videoId and streams video data
    transcodeVideo(Key, res);
  } catch (error) {
    console.error('Transcoding error:', error);
    res.status(500).json({ error: 'Failed to transcode video' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Video transcoding service running on port ${port}`);
});