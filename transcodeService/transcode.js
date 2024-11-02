require('dotenv').config();
const ffmpeg = require('fluent-ffmpeg');
const ffmpegpath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegpath);

const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { fromIni } = require('@aws-sdk/credential-provider-ini');

const s3 = new S3Client({
  region: 'ap-southeast-2',
  //credentials: fromIni({ profile: 'CAB432-STUDENT-901444280953' }),
});

async function transcodeVideo(videoId, res) {
  const s3Params = {
    Bucket: 'n11245409-assessment2',
    Key: videoId
  };
  try {
    // Fetch the video from S3
    const s3Data = await s3.send(new GetObjectCommand(s3Params));
    const s3Stream = s3Data.Body;

    // Set headers for video streaming
    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Disposition': 'inline',
      'Accept-Ranges': 'bytes'
    });

    // Stream the video with ffmpeg, transcoding it if necessary
    ffmpeg(s3Stream)
      .videoCodec('libx264')  // Using H.264 codec
      .audioCodec('aac')      // Using AAC codec
      .format('mp4')
      .outputOptions([
        '-movflags frag_keyframe+empty_moov',  // Allows the video to be played before being fully downloaded
        '-preset veryslow',   // Ensure transcoding quality is as high as possible
        '-crf 18' // crf 18 ensures high quality transcoding
      ])
      .on('error', (err) => {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Error in video transcoding' }));
        } else {
          res.end();  // If headers are already sent, end the response gracefully
        }
      })
      .pipe(res, { end: true });
  } catch (err) {
    console.error('Error streaming video from S3:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Error fetching video from S3' }));
    } else {
      res.end();  // End the response gracefully if headers were already sent
    }
  }
}

module.exports = {
  transcodeVideo
};