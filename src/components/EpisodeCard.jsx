import React from 'react';
import { Link } from 'react-router-dom';

export default function EpisodeCard({ ep }) {
  return (
    <div className="card">
      {ep.coverFile ? <img src={`http://localhost:4000${ep.coverFile}`} alt="cover" /> : <div className="cover-placeholder">ปก</div>}
      <h3>{ep.title}</h3>
      <p className="date">{ep.date}</p>
      <p className="desc">{ep.desc}</p>
      <Link to={`/episode/${ep.id}`} className="btn">ฟังตอนนี้</Link>
    </div>
  );
}
