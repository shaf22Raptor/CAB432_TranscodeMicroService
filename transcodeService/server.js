const express = require('express');
const { transcodeVideo } = require('./transcode');  // Import the transcoding logic
const app = express();
const port = 5001;

// Middleware to parse JSON request bodies
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send('Healthy');
});

// Route to handle transcoding requests
app.post('/transcode', async (req, res) => {
  const Key  = req.body.key;
  console.log(Key);
  console.log("service: transcode: ", Key);

  if (!Key) {
    return res.status(400).json({ error: 'Video ID is required' });
  }

  try {
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