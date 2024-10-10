import { useEffect, useState } from 'react';
import './AudioList.css';
import AudioCard from '../AudioCard/Card';
import audiosData from "@/audios.json";

const AudioList = () => {
  const [audios, setAudios] = useState([]);

  useEffect(() => {
    setAudios(audiosData.flat());
  }, []);

  return (
    <div className="audio-list">
      {audios.map((audio, index) => (
        <AudioCard key={audio.id || index} audio={audio} />
      ))}
    </div>
  );
};

export default AudioList;