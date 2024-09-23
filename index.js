const express = require('express');
const app = express();
const path = require('path');
const mm = require('music-metadata'); // Import music-metadata for extracting metadata
const fs = require('fs');

// Serve static files (e.g., mp3 files)
app.use('/quran', express.static(path.join(__dirname, 'quran')));

// Endpoint to get surah metadata and file
app.get('/quran/:filename', async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'quran', filename);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  try {
    // Extract metadata from the audio file
    const metadata = await mm.parseFile(filePath);

    // Example metadata: title, artist, duration, etc.
    const surahMetadata = {
      name: metadata.common.title || filename,
      reciter: metadata.common.artist || 'Unknown Reciter',
      duration: Math.floor(metadata.format.duration / 60) + ':' + ('0' + Math.floor(metadata.format.duration % 60)).slice(-2),
      bitrate: metadata.format.bitrate,
      sampleRate: metadata.format.sampleRate,
    };

    // Send metadata and file URL in the response
    res.json({
      metadata: surahMetadata,
      fileUrl: `http://localhost:3000/quran/${filename}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing file' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
