const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // Import CORS

const app = express();
const PORT = 3000;

// Use CORS middleware
app.use(cors());
app.use(express.json());

// Directory where mp3 files are stored
const AUDIO_DIR = path.join(__dirname, 'audio');

// Middleware to check if file exists
function checkFileExists(req, res, next) {
  const fileName = req.params.fileName;
  const filePath = path.join(AUDIO_DIR, fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }
    req.filePath = filePath;
    next();
  });
}

// Route to serve the audio file directly
app.get('/audio/:fileName', checkFileExists, (req, res) => {
  const filePath = req.filePath;

  // Serve the audio file directly
  res.setHeader('Content-Type', 'audio/mpeg');
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
