/* ======================================================================
   BAB 6 — LOGIKA HALAMAN ADMIN (admin.html)
   Alur: 6.1 Gerbang akses > 6.2 Ambil data dari GitHub > 6.3 Render form >
         6.4 Aksi edit/tambah/hapus project > 6.5 Simpan & Publish ke GitHub
   ====================================================================== */

(function(){
  const TOKEN_KEY = "meilisa_admin_gh_token"; // token cuma disimpan di browser device ini

  let content = null, projects = null, settings = null;
  let shas = { content: null, projects: null, settings: null };
  let editingProjectId = null;

  /* ---------- 6.1 GERBANG AKSES ---------- */
  const gate = document.getElementById("gate");
  const dash = document.getElementById("dash");
  const passInput = document.getElementById("gatePassword");
  const tokenInput = document.getElementById("gateToken");
  const gateBtn = document.getElementById("gateEnter");
  const gateError = document.getElementById("gateError");

  // isi otomatis kalau token sudah pernah disimpan di device ini
  const savedToken = localStorage.getItem(TOKEN_KEY);
  if(savedToken) tokenInput.value = savedToken;

  gateBtn.addEventListener("click", async () => {
    gateError.textContent = "";
    if(passInput.value !== SITE_CONFIG.ADMIN_PASSWORD){
      gateError.textContent = "Password salah.";
      return;
    }
    const token = tokenInput.value.trim();
    if(!token){
      gateError.textContent = "Personal Access Token GitHub wajib diisi (lihat README untuk cara membuatnya).";
      return;
    }
    gateBtn.textContent = "Memeriksa...";
    gateBtn.disabled = true;
    try{
      await githubTestToken(token);
      localStorage.setItem(TOKEN_KEY, token);
      window.GH_TOKEN = token;
      await loadAllData();
      gate.style.display = "none";
      dash.classList.add("active");
      renderAll();
    }catch(e){
      gateError.textContent = "Token tidak valid atau tidak punya akses ke repo ini. Cek lagi.";
    }
    gateBtn.textContent = "Masuk";
    gateBtn.disabled = false;
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    if(confirm("Keluar dari mode edit? (token tetap tersimpan di browser ini)")){
      location.reload();
    }
  });

  /* ---------- 6.2 KOMUNIKASI DENGAN GITHUB API ---------- */
  const API_BASE = "https://api.github.com/repos/" + SITE_CONFIG.GITHUB_OWNER + "/" + SITE_CONFIG.GITHUB_REPO;

  async function githubTestToken(token){
    const res = await fetch(API_BASE, { headers: { Authorization: "Bearer " + token } });
    if(!res.ok) throw new Error("invalid");
  }

  async function githubGetFile(path){
    const res = await fetch(API_BASE + "/contents/" + path + "?ref=" + SITE_CONFIG.GITHUB_BRANCH, {
      headers: { Authorization: "Bearer " + window.GH_TOKEN }
    });
    if(!res.ok) throw new Error("Gagal mengambil " + path);
    const data = await res.json();
    const jsonText = decodeURIComponent(escape(atob(data.content.replace(/\n/g, ""))));
    return { json: JSON.parse(jsonText), sha: data.sha };
  }

  async function githubPutFile(path, sha, obj, message){
    const jsonText = JSON.stringify(obj, null, 2);
    const b64 = btoa(unescape(encodeURIComponent(jsonText)));
    const res = await fetch(API_BASE + "/contents/" + path, {
      method: "PUT",
      headers: { Authorization: "Bearer " + window.GH_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        content: b64,
        sha: sha,
        branch: SITE_CONFIG.GITHUB_BRANCH
      })
    });
    if(!res.ok){
      const err = await res.json().catch(()=>({}));
      throw new Error(err.message || "Gagal menyimpan " + path);
    }
    const data = await res.json();
    return data.content.sha;
  }

  async function loadAllData(){
    const c = await githubGetFile("data/content.json");
    const p = await githubGetFile("data/projects.json");
    const s = await githubGetFile("data/settings.json");
    content = c.json; shas.content = c.sha;
    projects = p.json; shas.projects = p.sha;
    settings = s.json; shas.settings = s.sha;
  }

  /* ---------- 6.5 SIMPAN & PUBLISH ---------- */
  const statusMsg = document.getElementById("statusMsg");
  document.getElementById("publishBtn").addEventListener("click", async () => {
    statusMsg.textContent = "Menyimpan ke GitHub...";
    statusMsg.className = "status-msg";
    try{
      shas.content = await githubPutFile("data/content.json", shas.content, content, "Update content.json lewat admin panel");
      shas.projects = await githubPutFile("data/projects.json", shas.projects, projects, "Update projects.json lewat admin panel");
      shas.settings = await githubPutFile("data/settings.json", shas.settings, settings, "Update settings.json lewat admin panel");
      statusMsg.textContent = "Tersimpan! Web publik akan ikut berubah dalam ~30-60 detik.";
      statusMsg.className = "status-msg ok";
    }catch(e){
      statusMsg.textContent = "Gagal menyimpan: " + e.message;
      statusMsg.className = "status-msg err";
    }
  });

  /* ---------- 6.3 TAB NAVIGASI ---------- */
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
      document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("panel-" + btn.dataset.tab).classList.add("active");
    });
  });

  /* ---------- 6.3 RENDER SEMUA FORM ---------- */
  function renderAll(){
    renderHeroForm();
    renderAboutForm();
    renderSkillsForm();
    renderExperienceForm();
    renderProjectsList();
    renderContactForm();
    renderAppearanceForm();
  }

  function bind(id, value, onInput){
    const el = document.getElementById(id);
    el.value = value ?? "";
    el.addEventListener("input", () => onInput(el.value));
  }

  function renderHeroForm(){
    bind("hName", content.hero.name, v => content.hero.name = v);
    bind("hTitle", content.hero.title, v => content.hero.title = v);
    bind("hDesc", content.hero.description, v => content.hero.description = v);
    bind("hCV", content.hero.cvLink, v => content.hero.cvLink = v);
    ["github","instagram","facebook","x","youtube","linkedin"].forEach(key=>{
      bind("hSocial_"+key, content.hero.socials[key], v => content.hero.socials[key] = v);
    });
  }

  function renderAboutForm(){
    bind("aBio", content.about.bio, v => content.about.bio = v);
    const wrap = document.getElementById("aSpecsWrap");
    wrap.innerHTML = "";
    content.about.specs.forEach((spec, idx) => {
      const row = document.createElement("div");
      row.className = "field-row";
      row.style.marginBottom = "10px";
      row.innerHTML = `
        <input type="text" value="${escAttr(spec.k)}" placeholder="Label (cth: Program)">
        <input type="text" value="${escAttr(spec.v)}" placeholder="Isi">
      `;
      const [kInput, vInput] = row.querySelectorAll("input");
      kInput.addEventListener("input", () => spec.k = kInput.value);
      vInput.addEventListener("input", () => spec.v = vInput.value);
      wrap.appendChild(row);
    });
  }

  function renderSkillsForm(){
    const wrap = document.getElementById("skillsWrap");
    wrap.innerHTML = "";
    content.skills.forEach((group) => {
      const box = document.createElement("fieldset");
      box.innerHTML = `<legend>Grup</legend>
        <div class="field"><label>Nama grup</label><input type="text" class="g-name" value="${escAttr(group.group)}"></div>
        <div class="field"><label>Daftar skill (pisahkan koma)</label><input type="text" class="g-items" value="${escAttr((group.items||[]).join(", "))}"></div>`;
      box.querySelector(".g-name").addEventListener("input", e => group.group = e.target.value);
      box.querySelector(".g-items").addEventListener("input", e => group.items = e.target.value.split(",").map(s=>s.trim()).filter(Boolean));
      wrap.appendChild(box);
    });
  }

  function renderExperienceForm(){
    const wrap = document.getElementById("expWrap");
    wrap.innerHTML = "";
    content.experience.forEach((item) => {
      const box = document.createElement("fieldset");
      box.innerHTML = `<legend>Timeline</legend>
        <div class="field-row">
          <div class="field"><label>Tahun</label><input type="text" class="e-year" value="${escAttr(item.year)}"></div>
          <div class="field"><label>Badge (opsional)</label><input type="text" class="e-badge" value="${escAttr(item.badge)}"></div>
        </div>
        <div class="field"><label>Judul</label><input type="text" class="e-title" value="${escAttr(item.title)}"></div>
        <div class="field"><label>Deskripsi</label><textarea class="e-desc">${esc(item.desc)}</textarea></div>`;
      box.querySelector(".e-year").addEventListener("input", e => item.year = e.target.value);
      box.querySelector(".e-badge").addEventListener("input", e => item.badge = e.target.value);
      box.querySelector(".e-title").addEventListener("input", e => item.title = e.target.value);
      box.querySelector(".e-desc").addEventListener("input", e => item.desc = e.target.value);
      wrap.appendChild(box);
    });
  }

  function renderContactForm(){
    bind("cEmail", content.contact.email, v => content.contact.email = v);
    bind("cWA", content.contact.whatsapp, v => content.contact.whatsapp = v);
    bind("cIG", content.contact.instagram, v => content.contact.instagram = v);
  }

  /* --- Tampilan (font, background, layout) --- */
  function renderAppearanceForm(){
    const fontWrap = document.getElementById("fontSwatches");
    fontWrap.innerHTML = Object.keys(FONT_PRESETS).map(key => `
      <div class="swatch ${settings.fontPreset===key?"selected":""}" data-font="${key}">
        <div class="preview" style="font-family:${FONT_PRESETS[key].display}; display:flex;align-items:center;justify-content:center;background:#f6f8fa;font-size:15px;">Aa</div>
        <span>${FONT_PRESETS[key].label.split(" (")[0]}</span>
      </div>`).join("");
    fontWrap.querySelectorAll(".swatch").forEach(sw => sw.addEventListener("click", () => {
      settings.fontPreset = sw.dataset.font;
      renderAppearanceForm();
    }));

    const bgWrap = document.getElementById("bgSwatches");
    bgWrap.innerHTML = Object.keys(BG_PRESETS).map(key => `
      <div class="swatch ${settings.bgPreset===key?"selected":""}" data-bg="${key}">
        <div class="preview" style="background:${BG_PRESETS[key].bg}; border:1px solid ${BG_PRESETS[key].line}"></div>
        <span>${BG_PRESETS[key].label}</span>
      </div>`).join("");
    bgWrap.querySelectorAll(".swatch").forEach(sw => sw.addEventListener("click", () => {
      settings.bgPreset = sw.dataset.bg;
      renderAppearanceForm();
    }));

    document.getElementById("projColumns").value = settings.projectColumns;
    document.getElementById("aboutLayout").value = settings.aboutLayout;
  }
  document.getElementById("projColumns").addEventListener("change", e => settings.projectColumns = parseInt(e.target.value,10));
  document.getElementById("aboutLayout").addEventListener("change", e => settings.aboutLayout = e.target.value);

  /* ---------- 6.4 PROJECT CRUD ---------- */
  function renderProjectsList(){
    const list = document.getElementById("projList");
    list.innerHTML = "";
    projects.forEach(p => {
      const item = document.createElement("div");
      item.className = "admin-proj-item";
      item.innerHTML = `
        <div class="info"><h4>${esc(p.title)}</h4><span>${(p.tags||[]).join(", ")}</span></div>
        <div class="actions">
          <button class="icon-btn edit" title="Edit">✎</button>
          <button class="icon-btn del" title="Hapus">🗑</button>
        </div>`;
      item.querySelector(".edit").addEventListener("click", () => openProjectModal(p.id));
      item.querySelector(".del").addEventListener("click", () => {
        if(confirm("Hapus project ini dari daftar? (Klik 'Simpan & Publish' setelahnya agar berlaku)")){
          projects = projects.filter(x => x.id !== p.id);
          renderProjectsList();
        }
      });
      list.appendChild(item);
    });
  }
  document.getElementById("addProjectBtn").addEventListener("click", () => openProjectModal(null));

  const modal = document.getElementById("projectModal");
  const pfTitle = document.getElementById("pfTitle");
  const pfTags = document.getElementById("pfTags");
  const pfDesc = document.getElementById("pfDesc");
  const pfImage = document.getElementById("pfImage");

  function openProjectModal(id){
    editingProjectId = id;
    if(id){
      const p = projects.find(x=>x.id===id);
      document.getElementById("modalTitleText").textContent = "Edit Karya";
      pfTitle.value = p.title; pfTags.value = (p.tags||[]).join(", "); pfDesc.value = p.desc||"";
    }else{
      document.getElementById("modalTitleText").textContent = "Tambah Karya";
      pfTitle.value = ""; pfTags.value = ""; pfDesc.value = "";
    }
    pfImage.value = "";
    modal.classList.add("open");
  }
  document.getElementById("pfCancel").addEventListener("click", () => modal.classList.remove("open"));
  document.getElementById("pfSave").addEventListener("click", () => {
    const title = pfTitle.value.trim();
    if(!title){ alert("Judul wajib diisi."); return; }
    const tags = pfTags.value.split(",").map(t=>t.trim()).filter(Boolean);
    const desc = pfDesc.value.trim();
    const file = pfImage.files[0];

    function finish(imageData){
      if(editingProjectId){
        const p = projects.find(x=>x.id===editingProjectId);
        p.title=title; p.tags=tags; p.desc=desc;
        if(imageData) p.image = imageData;
      }else{
        projects.push({ id: "p"+Date.now(), title, tags, desc, image: imageData || "" });
      }
      renderProjectsList();
      modal.classList.remove("open");
    }
    if(file){
      const reader = new FileReader();
      reader.onload = e => finish(e.target.result);
      reader.readAsDataURL(file);
    }else{
      finish(null);
    }
  });

  function esc(str){ const d=document.createElement("div"); d.textContent = str ?? ""; return d.innerHTML; }
  function escAttr(str){ return (str ?? "").replace(/"/g, "&quot;"); }

})();
