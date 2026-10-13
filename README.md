# NUSAPALA — Website & Sistem Informasi Mapala IBN

Situs resmi dan sistem manajemen internal **Mahasiswa Pecinta Alam (Mapala) Institut Bisnis Nusantara**:
jadwal kegiatan, arus kas, ceklist iuran, inventaris alat, peminjaman logistik, persuratan,
laporan/aduan, operasional lapangan, cuaca gunung, hingga verifikasi KTA berbasis QR.

---

## 1. Halaman

| Rute | Berkas | Isi |
| --- | --- | --- |
| `/` | `public/index.html` | Beranda publik: hero, agenda, galeri, tiga divisi, alur peminjaman alat, transparansi kas & inventaris, widget cuaca & status operasional |
| `/admin` | `public/admin.html` | Portal Admin: login (password / QR KTA), dashboard, database anggota, registrasi, arus kas, ceklist iuran, inventaris, layanan & laporan, agenda, operasional lapangan, hak akses, pengaturan |
| `/registrasi` | `public/registrasi.html` | Pendaftaran akun mandiri dengan validasi real-time |
| `/cuaca-gunung` | `public/cuaca-gunung.html` | Prakiraan cuaca 7 hari gunung-gunung Indonesia (Open-Meteo) |
| `/verify` | `api/kartu.js` | Endpoint verifikasi KTA (Vercel Serverless Function) |

## 2. Teknologi

- **Frontend:** HTML + Bootstrap 5 + FontAwesome 6 + SweetAlert2 (via CDN)
- **Font:** Fraunces (display) · Inter (UI) · IBM Plex Mono (data/label)
- **Backend:** Supabase (PostgreSQL + Realtime) — tabel `members`, `settings`, `kegiatan`, `posts`,
  `iuran`, `kas_keluar`, `aset`, `peminjaman_aset`, `pengaduan_saran`, `surat`, `kegiatan_operasional`, `notifikasi`
- **Hosting:** Vercel (`vercel.json` mengaktifkan `cleanUrls` dan rewrite `/verify`)

## 3. Design System "Deep Forest & Brass"

Seluruh halaman memakai satu sumber gaya bersama:

```
public/assets/css/nusapala.css   ← token warna, tipografi, komponen, animasi
public/assets/js/nusapala-ui.js  ← master data divisi, reveal/stagger, counter,
                                   scroll progress, combobox, ticker, toast
```

Berkas CSS dimuat **setelah** `<style>` bawaan tiap halaman sehingga design system yang menang.

Prinsip yang dipegang:

1. **Kontras aman** — setiap pasangan warna teks/latar memenuhi WCAG AA
   (≥ 4.5:1 teks normal, ≥ 3:1 teks besar & ikon). Kelas Bootstrap yang rawan
   (`text-warning`, `text-info`, `text-white-50`, dsb.) dipetakan ulang ke varian gelap.
2. **Identitas mapala** — hijau kanopi dalam, aksen kuningan, kertas krem, motif garis
   kontur topografi, dan siluet punggungan gunung.
3. **Gerak halus** — easing `cubic-bezier(0.22, 1, 0.36, 1)`, reveal berjenjang (stagger),
   counter angka, sheen kuningan, ripple tombol, ticker agenda.
   Semuanya otomatis nonaktif pada `prefers-reduced-motion`.

## 4. Master Data Divisi

Tiga divisi baku Nusapala disimpan pada `settings.kategori_divisi`:

| Kode | Divisi | Ikon | Tema warna |
| --- | --- | --- | --- |
| DIV-01 | Gunung Hutan | `fa-mountain` | hijau kanopi |
| DIV-02 | Rock Climbing | `fa-person-hiking` | tanah liat / terracotta |
| DIV-03 | Olahraga Arus Deras | `fa-water` | biru sungai |

Catatan teknis:

- Nama lama (`Rafting/Orad`, `Panjat Tebing`, dsb.) dikenali sebagai **alias** dan
  dinormalkan otomatis, sehingga data lawas tetap terbaca.
- **Admin → Pengaturan → Data Divisi Organisasi**: tombol tambah cepat tiga divisi baku,
  input divisi bebas (Enter = tambah), edit/hapus per baris, jumlah anggota per divisi,
  serta utilitas **"Rapikan Nama Divisi"** untuk memigrasikan penamaan lama sekaligus
  memperbarui data anggota.
- **Form Data Anggota** memakai combobox yang bisa *mengetik divisi baru*; untuk Super Admin
  divisi baru langsung tersimpan ke master data.
- **Formulir registrasi publik** selalu punya fallback ke tiga divisi baku — dropdown tidak
  akan pernah macet pada status "Gagal memuat data Divisi".

## 5. Menjalankan di Lokal

```bash
cd nusapala-verifikasi
npm install                 # hanya dibutuhkan untuk api/kartu.js
node tools/preview-server.js 5173
# buka http://localhost:5173
```

`tools/preview-server.js` adalah server statis tanpa dependensi yang meniru perilaku Vercel
(mendukung *clean URL*: `/admin` → `admin.html`).

## 6. Struktur Direktori

```
nusapala-verifikasi/
├── api/kartu.js              # Serverless function verifikasi KTA
├── public/
│   ├── index.html            # Beranda
│   ├── admin.html            # Portal Admin
│   ├── registrasi.html       # Pendaftaran mandiri
│   ├── cuaca-gunung.html     # Cuaca gunung
│   ├── assets/
│   │   ├── css/nusapala.css  # Design system
│   │   └── js/nusapala-ui.js # UI kit bersama
│   └── js/
│       ├── gunung-database.js
│       └── weather-service.js
├── tools/preview-server.js   # Server pratinjau lokal
└── vercel.json
```

## 7. Catatan Keamanan

Kunci Supabase saat ini tertanam di berkas publik (halaman depan memang membaca data publik).
Untuk jangka panjang disarankan memindahkan operasi tulis ke serverless function di `api/`
dan hanya memakai `anon key` di browser, lalu mengamankan sisanya dengan Row Level Security.
