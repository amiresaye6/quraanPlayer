const surahs = [
    { name: 'Al-Fatiha', file: '001.mp3' },
    { name: 'Al-Baqarah', file: '002.mp3' },
    { name: 'Al-Imran', file: '003.mp3' },
    { name: 'An-Nisa', file: '004.mp3' },
    { name: 'Al-Maidah', file: '005.mp3' },
    // Add more Surahs as needed
];

const buttonContainer = document.getElementById('buttonContainer');

if (buttonContainer) {
    surahs.forEach(surah => {
        const button = document.createElement('button');
        button.textContent = surah.name;
        button.value = surah.file;
        button.classList.add('surah-button');
        button.addEventListener('click', () => {
            playAudio(surah.file);
        });
        buttonContainer.appendChild(button);
    });
}

const playAudio = async (fileName) => {
    const errorElement = document.getElementById('error');
    const audioPlayer = document.getElementById('audioPlayer');
    const audioSource = document.getElementById('audioSource');
    const metadataElement = document.getElementById('metadata');

    errorElement.textContent = '';
    metadataElement.style.display = 'none';
    audioPlayer.style.display = 'none';

    try {
        const response = await fetch(`http://localhost:3000/audio/${fileName}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('File not found');
        }

        // Set audio source
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        audioSource.src = audioUrl;

        // Show audio player
        audioPlayer.style.display = 'block';
        audioPlayer.load();

        // Read metadata using jsmediatags
        jsmediatags.read(blob, {
            onSuccess: function(tag) {
                const title = tag.tags.title || 'N/A';
                const artist = tag.tags.artist || 'N/A';
                const album = tag.tags.album || 'N/A';

                // Set duration when metadata is loaded
                audioPlayer.onloadedmetadata = function() {
                    const duration = audioPlayer.duration;
                    metadataElement.innerHTML = `
                        <h2>Metadata:</h2>
                        <p><strong>Title:</strong> ${title}</p>
                        <p><strong>Artist:</strong> ${artist}</p>
                        <p><strong>Album:</strong> ${album}</p>
                        <p><strong>Duration:</strong> ${duration ? `${duration.toFixed(2)} seconds` : 'N/A'}</p>
                    `;
                    metadataElement.style.display = 'block';
                };

                audioPlayer.play(); // Play audio after setting source and metadata
            },
            onError: function(error) {
                errorElement.textContent = 'Failed to read metadata: ' + error.message;
            }
        });

    } catch (error) {
        errorElement.textContent = error.message;
        audioPlayer.style.display = 'none';
        metadataElement.style.display = 'none';
    }
};
