const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const BOT_TOKEN = '7721759445:AAHYzo_uVGIIgx1_sDCsDAtN1f-EZSsCnSQ'; // Replace with your actual bot token

app.get('/api/audio-files', async (req, res) => {
  try {
    const response = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
    const audioFiles = response.data.result
      .flatMap(update => 
        update.message && update.message.audio ? [{
          id: update.message.audio.file_id,
          title: update.message.audio.title || 'Audio File',
          url: `https://api.telegram.org/file/bot${BOT_TOKEN}/${update.message.audio.file_path}`
        }] : [])
      .filter(audio => audio); // Filter out undefined

    res.json(audioFiles);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching audio files');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
