document.getElementById('playButton').addEventListener('click', async () => {
    const fileName = document.getElementById('fileName').value;
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
});

// Optional: Theme toggle
const toggleTheme = () => {
    document.body.classList.toggle('dark');
    const button = document.getElementById('themeToggle');
    button.textContent = document.body.classList.contains('dark') ? 'Switch to Light Mode' : 'Switch to Dark Mode';
};

// Create a theme toggle button (if needed)
const themeToggleButton = document.createElement('button');
themeToggleButton.id = 'themeToggle';
themeToggleButton.textContent = 'Switch to Dark Mode';
themeToggleButton.addEventListener('click', toggleTheme);
document.body.insertBefore(themeToggleButton, document.body.firstChild);
