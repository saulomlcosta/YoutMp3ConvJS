const express = require('express');
const ytdl = require('ytdl-core');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const cors = require('cors');

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use(express.static(__dirname));

app.post('/download', async (req, res) => {
  const { youtubeUrl } = req.body;

  try {
    const videoInfo = await ytdl.getBasicInfo(youtubeUrl);
    const videoTitle = videoInfo.videoDetails.title;

    res.attachment(`${videoTitle}`);
    fetchAndStreamAudio(youtubeUrl, res);
  } catch (error) {
    console.error('Error fetching and converting the audio:', error);
    res.status(500).json({ error: 'Error fetching and converting the audio.' });
  }
});

async function fetchAndStreamAudio(url, response) {
  try {
    const videoStream = ytdl(url, { quality: 'highestaudio' });

    const ffmpegCommand = ffmpeg(videoStream)
      .audioBitrate(128)
      .toFormat('mp3');

    ffmpegCommand.on('error', (err) => {
      console.error('Error converting the audio:', err);
      response.status(500).json({ error: 'Error converting the audio.' });
    });

    ffmpegCommand.pipe(response);
  } catch (error) {
    console.error('Error fetching the audio:', error);
    response.status(500).json({ error: 'Error fetching the audio.' });
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
