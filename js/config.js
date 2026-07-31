/* ======================================================================
   BAB 4 — KONFIGURASI (dipakai oleh main.js dan admin.js)
   ====================================================================== */

/* --- 4.1 Info repo GitHub kamu ---
   GANTI 3 baris ini sesuai punya kamu:
   - GITHUB_OWNER : username GitHub kamu
   - GITHUB_REPO  : nama repo tempat web ini di-hosting (yang isinya index.html)
   - GITHUB_BRANCH: biasanya "main"
*/
const SITE_CONFIG = {
  GITHUB_OWNER: "meilisaamalia10071-design",
  GITHUB_REPO: "meilisa-portfolio-web",
  GITHUB_BRANCH: "main",

  /* --- 4.2 Password gerbang admin (lapisan pertama, sekadar penyaring cepat) --- */
  ADMIN_PASSWORD: "161616"
};

/* --- 4.3 Preset kombinasi font ---
   Tiap preset punya font display (judul), body (paragraf), dan mono (label kecil) */
const FONT_PRESETS = {
  technical: {
    label: "Technical (Space Grotesk + IBM Plex Sans)",
    google: "Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500",
    display: "'Space Grotesk', sans-serif",
    body: "'IBM Plex Sans', sans-serif",
    mono: "'IBM Plex Mono', monospace"
  },
  clean: {
    label: "Clean Corporate (Inter)",
    google: "Inter:wght@400;500;600;700",
    display: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'Inter', monospace"
  },
  elegant: {
    label: "Elegant (Playfair Display + Lato)",
    google: "Playfair+Display:wght@500;600;700&family=Lato:wght@400;500;600",
    display: "'Playfair Display', serif",
    body: "'Lato', sans-serif",
    mono: "'Lato', monospace"
  },
  friendly: {
    label: "Friendly Rounded (Poppins + Nunito Sans)",
    google: "Poppins:wght@500;600;700&family=Nunito+Sans:wght@400;500;600",
    display: "'Poppins', sans-serif",
    body: "'Nunito Sans', sans-serif",
    mono: "'Nunito Sans', monospace"
  }
};

/* --- 4.4 Preset latar belakang ---
   Tiap preset mengubah warna dasar (bg), permukaan (surface), teks (ink), dan aksen */
const BG_PRESETS = {
  white: {
    label: "Putih Bersih",
    bg: "#ffffff", surface: "#f6f8fa", surface2: "#eef1f4", line: "#e1e6eb",
    ink: "#101c28", inkSoft: "#57687a", inkFaint: "#8996a3"
  },
  softblue: {
    label: "Biru Lembut",
    bg: "#f7faff", surface: "#eef4ff", surface2: "#e3ecfc", line: "#dbe6f7",
    ink: "#101c28", inkSoft: "#57687a", inkFaint: "#8996a3"
  },
  cream: {
    label: "Krem Hangat",
    bg: "#fdfaf4", surface: "#f6efe1", surface2: "#f0e6d2", line: "#e9dcc3",
    ink: "#1f1a12", inkSoft: "#6b5f4a", inkFaint: "#9c8f76"
  },
  dark: {
    label: "Gelap",
    bg: "#0e141b", surface: "#161f29", surface2: "#1d2733", line: "#2a3542",
    ink: "#eef2f6", inkSoft: "#a9b6c2", inkFaint: "#7c8996"
  }
};
