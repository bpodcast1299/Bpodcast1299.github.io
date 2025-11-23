import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

export default function EpisodePage() {
  const { id } = useParams();
  const [ep, setEp] = useState(null);

  useEffect(() => {
    API.get(`/episodes/${id}`).then(r => setEp(r.data)).catch(() => {});
  }, [id]);

  if (!ep) return <div>Loading...</div>;

  return (
    <div className="page">
      <h1>{ep.title}</h1>
      {ep.coverFile && <img src={`http://localhost:4000${ep.coverFile}`} alt="cover" />}
      <p>{ep.date}</p>
      <p>{ep.desc}</p>
      {ep.audioFile ? (
        <audio controls src={`http://localhost:4000${ep.audioFile}`} />
      ) : (
        <div>No audio</div>
      )}
    </div>
  );
}
