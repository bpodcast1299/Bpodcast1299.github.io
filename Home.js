import React, { useEffect, useState } from 'react';
import API from './api';
import EpisodeCard from './components/EpisodeCard';

export default function Home() {
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    API.get('/episodes').then(r => setEpisodes(r.data)).catch(() => {});
  }, []);

  return (
    <div className="container">
      <h1>เรื่องเล่าค่ำคืน</h1>
      <div className="episodes-row">
        {episodes.map(ep => <EpisodeCard key={ep.id} ep={ep} />)}
      </div>
    </div>
  );
}
