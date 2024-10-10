/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import './AudioCard.css';

const AudioCard = ({ audio }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      const updateTime = () => setCurrentTime(audioElement.currentTime);
      audioElement.addEventListener('timeupdate', updateTime);
      return () => {
        audioElement.removeEventListener('timeupdate', updateTime);
      };
    }
  }, []);

  const togglePlayback = (e) => {
    e.stopPropagation();
    const audioElement = audioRef.current;
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying((prev) => !prev);
    }
  };

  const handleCardClick = () => {
    setShowDetails(true);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="audio-card" onClick={handleCardClick}>
      <h3 className="audio-title">{audio.title}</h3>
      <p className="audio-performer">{audio.performer}</p>
      <p className="audio-duration">Duration: {audio.duration} seconds</p>
      {showDetails && (
        <div className="audio-details">
          <p className="audio-file-size">File Size: {audio.file_size} bytes</p>
          <audio ref={audioRef} src={audio.file_path} />
          <div className="audio-controls">
            <button className="play-pause-btn" onClick={togglePlayback}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <p>range</p>
            <input
              type="range"
              className="seek-bar"
              min="0"
              max={audio.duration}
              value={currentTime}
              onChange={handleSeek}
            />
            <p>Current Time: {formatTime(currentTime)} / {formatTime(audio.duration)}</p>
            <p>volium</p>
            <input
              type="range"
              className="volume-bar"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioCard;
