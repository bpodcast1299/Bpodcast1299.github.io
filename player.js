// player.js - supports simple inline player and full modal player
async function fetchEpisodes(){
  try {
    const res = await fetch('/episodes.json');
    const eps = await res.json();
    renderEpisodes(eps);
  } catch(e){
    console.error('load episodes failed', e);
  }
}

function renderEpisodes(eps){
  if(!eps || !eps.length) return;
  // latest = first item (assume sorted)
  const latest = eps[0];
  document.getElementById('latestTitle').textContent = latest.title;
  document.getElementById('latestDesc').textContent = latest.description;
  document.getElementById('latestImage').src = latest.image || 'https://via.placeholder.com/300x300?text=Podcast';
  // simple inline player
  const inline = document.createElement('audio');
  inline.controls = true;
  inline.src = latest.audio;
  document.getElementById('latestPlayer').innerHTML = '';
  document.getElementById('latestPlayer').appendChild(inline);

  const list = document.getElementById('episodeList');
  list.innerHTML = '';
  eps.forEach((ep, idx) => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6';
    col.innerHTML = `
      <div class="card p-3 h-100">
        <div class="d-flex gap-3">
          <img src="${ep.image||'https://via.placeholder.com/150'}" alt="" style="width:100px; height:100px; object-fit:cover;" class="rounded" />
          <div class="flex-grow-1">
            <div class="episode-title">${ep.title}</div>
            <div class="small-muted mb-2">${new Date(ep.created||Date.now()).toLocaleString()}</div>
            <p class="text-muted small">${ep.description||''}</p>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-primary" onclick="playSimple('${encodeURIComponent(ep.audio)}')">Play (Simple)</button>
              <button class="btn btn-sm btn-outline-secondary" onclick="playFull('${encodeURIComponent(ep.audio)}','${ep.title.replace(/'/g,"&#39;")}','${(ep.description||'').replace(/'/g,"&#39;")}')">Play (Full)</button>
            </div>
          </div>
        </div>
      </div>
    `;
    list.appendChild(col);
  });
}

function playSimple(urlEnc){
  const url = decodeURIComponent(urlEnc);
  const audio = document.createElement('audio');
  audio.src = url;
  audio.controls = true;
  // replace latestPlayer with this simple player
  document.getElementById('latestPlayer').innerHTML = '';
  document.getElementById('latestPlayer').appendChild(audio);
  audio.play().catch(()=>{});
}

function playFull(urlEnc,title,desc){
  const url = decodeURIComponent(urlEnc);
  document.getElementById('playerTitle').textContent = title;
  document.getElementById('modalDesc').textContent = desc;
  const pa = document.getElementById('modalAudio');
  pa.src = url;
  const modal = new bootstrap.Modal(document.getElementById('playerModal'));
  modal.show();
}

// Load episodes on start
document.addEventListener('DOMContentLoaded', fetchEpisodes);
