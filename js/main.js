/* ======================================================================
   BAB 5 — LOGIKA WEB PUBLIK (index.html)
   Alur: 5.1 Ambil data > 5.2 Terapkan tampilan > 5.3 Render tiap section
   ====================================================================== */

(function(){

  /* --- 5.1 Ambil data JSON ---
     Tambah "?t=timestamp" supaya browser tidak menampilkan versi lama (cache) */
  async function loadJSON(path){
    const res = await fetch(path + "?t=" + Date.now());
    if(!res.ok) throw new Error("Gagal memuat " + path);
    return res.json();
  }

  async function init(){
    let content, projects, settings;
    try{
      [content, projects, settings] = await Promise.all([
        loadJSON("data/content.json"),
        loadJSON("data/projects.json"),
        loadJSON("data/settings.json")
      ]);
    }catch(e){
      console.error(e);
      document.body.innerHTML = "<p style='padding:60px;font-family:sans-serif'>Gagal memuat data website. Pastikan file di folder /data ada dan bisa diakses.</p>";
      return;
    }
    applySettings(settings);
    renderHero(content.hero);
    renderAbout(content.about);
    renderSkills(content.skills);
    renderExperience(content.experience);
    renderProjects(projects);
    renderContact(content.contact);
    renderFooter(content.hero);
    initScrollReveal();
  }

  /* --- 5.2 Terapkan pengaturan tampilan (font, warna, layout) --- */
  function applySettings(settings){
    const font = FONT_PRESETS[settings.fontPreset] || FONT_PRESETS.technical;

    // muat font dari Google Fonts sesuai preset
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=" + font.google + "&display=swap";
    document.head.appendChild(link);

    const root = document.documentElement;
    root.style.setProperty("--font-display", font.display);
    root.style.setProperty("--font-body", font.body);
    root.style.setProperty("--font-mono", font.mono);
    root.style.setProperty("--project-columns", settings.projectColumns || 3);

    // preset warna diterapkan lewat CLASS (bukan inline style) supaya toggle
    // mode gelap/terang tetap bisa menimpanya lewat urutan CSS di variables.css
    ["preset-white","preset-softblue","preset-cream","preset-dark"].forEach(c => root.classList.remove(c));
    root.classList.add("preset-" + (settings.bgPreset || "white"));
  }

  /* --- ikon media sosial (SVG, logo saja tanpa teks) --- */
  const SOCIAL_ICONS = {
    github: '<svg viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.19 1.78 1.19 1.04 1.78 2.72 1.27 3.38.97.1-.75.4-1.27.73-1.56-2.56-.29-5.26-1.28-5.26-5.71 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.09 0 4.44-2.7 5.42-5.28 5.7.42.36.79 1.07.79 2.16v3.2c0 .3.21.66.8.55A10.51 10.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.55.21.95.47 1.37.88.41.42.67.82.88 1.37.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.21.55-.47.95-.88 1.37-.42.41-.82.67-1.37.88-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.55-.21-.95-.47-1.37-.88-.41-.42-.67-.82-.88-1.37-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.21-.55.47-.95.88-1.37.42-.41.82-.67 1.37-.88.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14c-.3.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.66-.67 1.07-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 12 8a4 4 0 0 1 0 8.16zm7.84-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M18.24 2H21.5l-7.1 8.12L22.8 22h-6.7l-5.24-6.87L4.9 22H1.64l7.6-8.69L1 2h6.86l4.74 6.27L18.24 2zm-1.17 18.2h1.8L7.02 3.7H5.1l11.97 16.5z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24"><path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.68H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>'
  };

  function socialLinks(socials){
    if(!socials) return "";
    return Object.keys(SOCIAL_ICONS)
      .filter(key => socials[key])
      .map(key => `<a href="${escAttr(socials[key])}" target="_blank" rel="noopener" aria-label="${key}">${SOCIAL_ICONS[key]}</a>`)
      .join("");
  }

  function esc(str){ const d = document.createElement("div"); d.textContent = str ?? ""; return d.innerHTML; }
  function escAttr(str){ return (str ?? "").replace(/"/g, "&quot;"); }

  /* --- 5.3 Render tiap section --- */

  function renderHero(hero){
    document.getElementById("heroName").textContent = hero.name;
    document.getElementById("heroDesc").textContent = hero.description;
    document.getElementById("heroSocials").innerHTML = socialLinks(hero.socials);
    document.querySelectorAll(".js-brand-name").forEach(el => el.textContent = hero.brand || (hero.name || "").split(" ")[0]);
    startTypewriter(hero.titles && hero.titles.length ? hero.titles : [hero.title || ""]);
  }

  /* --- 5.5 Efek mengetik bergantian untuk title di Hero --- */
  function startTypewriter(phrases){
    const el = document.getElementById("heroTitle");
    if(!el || !phrases.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduceMotion || phrases.length === 1){
      el.textContent = phrases[0];
      return;
    }

    el.innerHTML = '<span class="txt"></span><span class="cursor">&nbsp;</span>';
    const txtEl = el.querySelector(".txt");
    let phraseIndex = 0, charIndex = 0, deleting = false;

    function tick(){
      const current = phrases[phraseIndex];
      if(!deleting){
        charIndex++;
        txtEl.textContent = current.slice(0, charIndex);
        if(charIndex === current.length){
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
        setTimeout(tick, 55);
      }else{
        charIndex--;
        txtEl.textContent = current.slice(0, charIndex);
        if(charIndex === 0){
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 300);
          return;
        }
        setTimeout(tick, 30);
      }
    }
    tick();
  }

  /* --- 5.6 Animasi muncul saat section di-scroll --- */
  function initScrollReveal(){
    const items = document.querySelectorAll(".reveal");
    if(!items.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(el => observer.observe(el));
  }

  function renderAbout(about){
    document.getElementById("aboutBio").textContent = about.bio;
  }

  function renderSkills(skills){
    document.getElementById("skillsGroups").innerHTML = (skills || []).map(group => `
      <div class="skill-card">
        <h3><span class="dot"></span>${esc(group.group)}</h3>
        <div class="tag-row">${(group.items||[]).map(i => {
          const isFeatured = group.featured && i === group.featured;
          return `<span class="tag ${isFeatured ? "tag-featured" : ""}">${esc(i)}${isFeatured ? ' <span class="tag-badge">★</span>' : ""}</span>`;
        }).join("")}</div>
      </div>
    `).join("");
  }

  function renderExperience(experience){
    document.getElementById("timeline").innerHTML = (experience || []).map(item => `
      <div class="tl-item">
        <div class="tl-year">${esc(item.year)}</div>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.desc)}</p>
        ${item.badge ? `<span class="tl-badge">${esc(item.badge)}</span>` : ""}
      </div>
    `).join("");
  }

  function renderProjects(projects){
    document.getElementById("projGrid").innerHTML = (projects || []).map(p => `
      <div class="proj-card">
        <div class="proj-thumb">
          ${p.image ? `<img src="${p.image}" alt="${escAttr(p.title)}">` : `<div class="placeholder">Belum ada foto</div>`}
        </div>
        <div class="proj-body">
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.desc||"")}</p>
          <div class="proj-tags">${(p.tags||[]).map(t=>`<span>${esc(t)}</span>`).join("")}</div>
        </div>
      </div>
    `).join("");
  }

  function renderContact(contact){
    document.getElementById("contactEmail").textContent = contact.email;
    document.getElementById("contactEmail").href = "mailto:" + contact.email;
    document.getElementById("contactWA").textContent = "+" + contact.whatsapp;
    document.getElementById("contactWA").href = "https://wa.me/" + contact.whatsapp;
    document.getElementById("contactIG").textContent = "@" + contact.instagram;
    document.getElementById("contactIG").href = "https://instagram.com/" + contact.instagram;
  }

  function renderFooter(hero){
    document.getElementById("footerSocials").innerHTML = socialLinks(hero.socials);
  }

  /* --- nav mobile --- */
  document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    if(navToggle){
      navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
      navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));
    }
    initThemeToggle();
    init();
  });

  /* --- 5.4 Toggle mode gelap/terang (khusus pengunjung, tersimpan di browser mereka) --- */
  function initThemeToggle(){
    const THEME_KEY = "meilisa_theme";
    const btn = document.getElementById("themeToggle");
    if(!btn) return;

    const SUN_ICON = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4.6" stroke="currentColor" stroke-width="2.6"/><g fill="currentColor"><rect x="10.8" y="0.5" width="2.4" height="4.2" rx="1.2"/><rect x="10.8" y="19.3" width="2.4" height="4.2" rx="1.2"/><rect x="0.5" y="10.8" width="4.2" height="2.4" rx="1.2"/><rect x="19.3" y="10.8" width="4.2" height="2.4" rx="1.2"/><rect x="10.8" y="0.5" width="2.4" height="4.2" rx="1.2" transform="rotate(45 12 12)"/><rect x="10.8" y="19.3" width="2.4" height="4.2" rx="1.2" transform="rotate(45 12 12)"/><rect x="0.5" y="10.8" width="4.2" height="2.4" rx="1.2" transform="rotate(45 12 12)"/><rect x="19.3" y="10.8" width="4.2" height="2.4" rx="1.2" transform="rotate(45 12 12)"/></g></svg>';
    const MOON_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.42,23A11.22,11.22,0,0,1,1,12,11.26,11.26,0,0,1,13,1a1,1,0,0,1,.85.56,1,1,0,0,1-.08,1A7.76,7.76,0,0,0,12.38,7a8.2,8.2,0,0,0,8.37,8,9,9,0,0,0,1.13-.07,1,1,0,0,1,.92.4,1,1,0,0,1,.11,1A11.44,11.44,0,0,1,12.42,23ZM11.21,3.07A9.17,9.17,0,0,0,3,12a9.23,9.23,0,0,0,9.42,9,9.53,9.53,0,0,0,7.83-4A10.18,10.18,0,0,1,10.38,7,9.66,9.66,0,0,1,11.21,3.07Z"/></svg>';

    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const startDark = saved ? saved === "dark" : prefersDark;
    setTheme(startDark);

    btn.addEventListener("click", () => {
      const isDark = document.documentElement.classList.contains("dark-mode");
      setTheme(!isDark);
      localStorage.setItem(THEME_KEY, !isDark ? "dark" : "light");
    });

    function setTheme(dark){
      document.documentElement.classList.toggle("dark-mode", dark);
      btn.innerHTML = dark ? SUN_ICON : MOON_ICON;
    }
  }

})();
