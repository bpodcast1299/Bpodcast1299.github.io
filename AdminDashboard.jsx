import React, { useState, useEffect } from 'react';
import API from '../api';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [form, setForm] = useState({ title: '', date: '', desc: '', audioFile: '', coverFile: '' });

  useEffect(() => { API.get('/episodes').then(r=>setEpisodes(r.data)).catch(()=>{}); }, []);

  const login = async () => {
    const r = await API.post('/auth/login', { password });
    if (r.data.ok) setIsAdmin(true);
  };

  const uploadFile = async (file, type) => {
    const fd = new FormData();
    fd.append('file', file);
    const r = await API.post(`/upload/${type}`, fd);
    return r.data.filename;
  };

  const addEpisode = async () => {
    const r = await API.post('/episodes', form);
    setEpisodes(prev => [r.data, ...prev]);
  };

  return (
    <div className="admin">
      {!isAdmin ? (
        <div>
          <h2>Admin Login</h2>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button onClick={login}>Login (Today1299)</button>
        </div>
      ) : (
        <div>
          <h2>Dashboard</h2>
          <div className="episodes-list">
            {episodes.map(ep => (
              <div key={ep.id} className="ep-row">
                <strong>{ep.title}</strong>
              </div>
            ))}
          </div>

          <div className="edit-form">
            <input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} />
            <input placeholder="Date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} />
            <textarea placeholder="Desc" value={form.desc} onChange={e=>setForm({...form, desc: e.target.value})} />

            <input type="file" onChange={async e=>{ const f = e.target.files[0]; const url = await uploadFile(f,'audio'); setForm({...form,audioFile:url});}} />
            <input type="file" onChange={async e=>{ const f = e.target.files[0]; const url = await uploadFile(f,'cover'); setForm({...form,coverFile:url});}} />

            <button onClick={addEpisode}>Add Episode</button>
          </div>
        </div>
      )}
    </div>
  );
}
