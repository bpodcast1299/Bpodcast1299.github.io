// Admin app: Firebase Auth + Firestore CRUD (client-side)
// Initialize Firebase
const app = firebase.initializeApp(window.FIREBASE_CONFIG);
const auth = firebase.auth();
const db = firebase.firestore();

function signup(){
  const e = document.getElementById('email').value;
  const p = document.getElementById('password').value;
  if(!e||!p){ alert('enter'); return; }
  auth.createUserWithEmailAndPassword(e,p).then(()=>alert('Created, then ask owner to add your email to admins')).catch(alert);
}
function login(){
  const e = document.getElementById('email').value;
  const p = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(e,p).catch(alert);
}
function logout(){ auth.signOut().then(()=>location.reload()); }

async function checkAdmin(email){
  const ref = db.collection('meta').doc('site');
  const d = await ref.get();
  if(!d.exists) return false;
  const data = d.data();
  return Array.isArray(data.admins) && data.admins.includes(email);
}

auth.onAuthStateChanged(async user=>{
  if(!user){ document.getElementById('authBox').style.display='block'; document.getElementById('adminUI').style.display='none'; return; }
  const ok = await checkAdmin(user.email);
  if(!ok){ alert('Not admin. Ask owner to add your email in meta/site.admins'); auth.signOut(); return; }
  document.getElementById('authBox').style.display='none';
  document.getElementById('adminUI').style.display='block';
  document.getElementById('who').textContent = user.email;
  loadSite();
  loadEpisodes();
});

async function loadSite(){
  const ref = db.collection('meta').doc('site');
  const doc = await ref.get();
  if(!doc.exists) return;
  const d = doc.data();
  document.getElementById('siteTitle').value = d.title||'';
  document.getElementById('siteHeadline').value = d.headline||'';
  document.getElementById('siteDesc').value = d.description||'';
  document.getElementById('siteLogo').value = d.logo||'';
}
async function saveSite(){
  const ref = db.collection('meta').doc('site');
  await ref.set({
    title: document.getElementById('siteTitle').value,
    headline: document.getElementById('siteHeadline').value,
    description: document.getElementById('siteDesc').value,
    logo: document.getElementById('siteLogo').value
  }, { merge: true });
  alert('Saved site settings');
}

async function saveEpisode(){
  const id = document.getElementById('epId').value;
  const data = {
    title: document.getElementById('epTitle').value,
    description: document.getElementById('epDesc').value,
    audio: document.getElementById('epAudio').value,
    image: document.getElementById('epImage').value,
    created: Date.now()
  };
  if(id){
    await db.collection('episodes').doc(id).set(data, { merge:true });
  } else {
    await db.collection('episodes').add(data);
  }
  clearForm();
  loadEpisodes();
}

function clearForm(){
  document.getElementById('epId').value=''; document.getElementById('epTitle').value='';
  document.getElementById('epDesc').value=''; document.getElementById('epAudio').value=''; document.getElementById('epImage').value='';
}

async function loadEpisodes(){
  const snap = await db.collection('episodes').orderBy('created','desc').get();
  const list = document.getElementById('episodesList');
  list.innerHTML = '';
  snap.forEach(doc=>{
    const d = doc.data();
    const li = document.createElement('li');
    li.className='list-group-item d-flex justify-content-between align-items-start';
    li.innerHTML = `<div><div class="fw-bold">${d.title}</div><div class="small text-muted">${new Date(d.created).toLocaleString()}</div></div>
                    <div><button class="btn btn-sm btn-outline-primary me-2" onclick="editEpisode('${doc.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEpisode('${doc.id}')">Delete</button></div>`;
    list.appendChild(li);
  });
}

window.editEpisode = async (id)=>{
  const doc = await db.collection('episodes').doc(id).get();
  const d = doc.data();
  document.getElementById('epId').value = id;
  document.getElementById('epTitle').value = d.title||'';
  document.getElementById('epDesc').value = d.description||'';
  document.getElementById('epAudio').value = d.audio||'';
  document.getElementById('epImage').value = d.image||'';
}

window.deleteEpisode = async (id)=>{
  if(!confirm('Delete?')) return;
  await db.collection('episodes').doc(id).delete();
  loadEpisodes();
}
