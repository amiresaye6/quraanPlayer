const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Your Telegram bot token
const TELEGRAM_BOT_TOKEN = '7721759445:AAHYzo_uVGIIgx1_sDCsDAtN1f-EZSsCnSQ';

// Function to fetch the file path using the file_id
const getFilePath = async (fileId) => {
    try {
        const response = await axios.get(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
        return response.data.result.file_path;
    } catch (error) {
        console.error(`Error fetching file path for file_id ${fileId}:`, error);
        return null;
    }
};

// Endpoint to fetch all audio files
app.get('/audios', async (req, res) => {
    try {
        // Fetch updates to get the audio files
        const response = await axios.get(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
        const updates = response.data.result;

        // Extract audio files from updates
        const audioFiles = await Promise.all(
            updates.flatMap(async (update) => {
                const message = update.message;
                if (message && message.audio) {
                    const filePath = await getFilePath(message.audio.file_id);
                    return [{
                        file_id: message.audio.file_id,
                        title: message.audio.title,
                        performer: message.audio.performer,
                        file_size: message.audio.file_size,
                        duration: message.audio.duration,
                        file_unique_id: message.audio.file_unique_id,
                        file_path: filePath ? `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}` : null // Construct the full file path URL
                    }];
                }
                return [];
            })
        );

        // Filter out any null or undefined entries
        const filteredAudioFiles = audioFiles.filter(Boolean);

        // Write the audio files to a JSON file
        fs.writeFile('audios.json', JSON.stringify(filteredAudioFiles, null, 2), (err) => {
            if (err) {
                console.error('Error writing to audios.json:', err);
                return res.status(500).json({ error: 'Failed to save audio files' });
            }
            console.log('Audio files saved to audios.json');
        });

        // Return the array of audio objects
        res.json(filteredAudioFiles);
    } catch (error) {
        console.error('Error fetching audio files:', error);
        res.status(500).json({ error: 'Failed to fetch audio files' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
