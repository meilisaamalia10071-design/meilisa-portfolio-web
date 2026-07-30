# Portfolio Meilisa Amalia Susanto

Struktur project ini dibuat supaya gampang diedit di VS Code:

```
meilisa-portfolio/
├── index.html        ← Web PUBLIK (yang dilihat semua orang)
├── admin.html         ← Web EDITOR (khusus kamu, dikunci password + token)
├── css/
│   ├── variables.css  ← Warna, font, ukuran dasar
│   ├── style.css      ← Tampilan web publik
│   └── admin.css       ← Tampilan halaman editor
├── js/
│   ├── config.js       ← Info repo GitHub + pilihan font/background
│   ├── main.js         ← Logika web publik (baca data, tampilkan ke layar)
│   └── admin.js        ← Logika editor (baca & simpan data ke GitHub)
├── data/
│   ├── content.json    ← Isi teks: hero, about, skills, experience, contact
│   ├── projects.json   ← Daftar karya/project
│   └── settings.json   ← Pilihan font, warna, layout yang sedang aktif
└── README.md            ← File ini
```

## Cara kerja dua web ini

- **admin.html** = tempat kamu login dan edit apa saja (teks, project, tampilan).
- Saat kamu klik **"Simpan & Publish"**, admin.html mengirim perubahan langsung ke file JSON di repo GitHub kamu (lewat GitHub API).
- **index.html** selalu membaca isi terbaru dari file JSON itu setiap kali dibuka.
- Jadi: kamu edit di admin.html → tersimpan ke GitHub → index.html otomatis menampilkan versi terbaru ke semua pengunjung. Tidak perlu upload manual lagi setelah setup awal selesai.

## Setup awal (sekali saja)

### 1. Buka project ini di VS Code
Extract/pindahkan folder `meilisa-portfolio` ke komputer kamu, lalu buka lewat VS Code (`File > Open Folder`).

### 2. Sesuaikan `js/config.js`
Buka file itu, ganti 3 baris ini sesuai repo GitHub Pages kamu yang sudah ada:
```js
GITHUB_OWNER: "meilisaamalia10071-design",
GITHUB_REPO: "meilisaamalia",
GITHUB_BRANCH: "main",
```
Kalau mau ganti password mode edit, ubah baris `ADMIN_PASSWORD` di file yang sama.

### 3. Upload semua file ke repo GitHub Pages kamu
Upload seluruh isi folder ini (index.html, admin.html, folder css/, js/, data/) ke repo yang sama seperti sebelumnya — replace file index.html lama.

⚠️ **Penting:** repo kamu sekarang **Public**, artinya admin.html juga bisa diakses siapa saja yang tahu link-nya. Itu tidak masalah karena tetap dikunci password + token — tapi supaya lebih aman, sebaiknya ganti repo jadi **Private** kalau paket GitHub kamu mendukung, atau pastikan tidak membagikan link admin.html ke orang lain.

### 4. Buat GitHub Personal Access Token (buat login ke admin.html)
1. Buka https://github.com/settings/tokens?type=beta
2. Klik **Generate new token**
3. Kasih nama, misal "Portfolio Admin"
4. Pada **Repository access**, pilih **Only select repositories** → pilih repo portofolio kamu
5. Pada **Permissions**, cari **Contents** → ubah ke **Read and write**
6. Klik **Generate token**, lalu **salin token itu** (hanya muncul sekali!)

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

### 5. Login ke admin.html
Buka `https://{username}.github.io/{repo}/admin.html`, masukkan password (default: `161616`) dan token yang baru dibuat. Token akan otomatis diingat di browser itu untuk login berikutnya.

## Menjalankan secara lokal (opsional, buat coba-coba sebelum upload)
Di VS Code, install extension **Live Server**, klik kanan pada `index.html` → **Open with Live Server**. Ini penting karena membuka file HTML langsung (dobel klik) tidak bisa membaca file JSON (dibatasi browser); harus lewat server lokal seperti Live Server.

## Catatan keamanan token
- Token hanya tersimpan di `localStorage` browser device kamu sendiri — tidak pernah dikirim ke server lain selain GitHub.
- Jangan pernah commit token ke dalam file di repo.
- Kalau token bocor/hilang kendali, buka kembali GitHub Settings > Developer settings > Personal access tokens, lalu **Delete/Revoke** token itu dan buat yang baru.
