# NUSAPALA — Dashboard Digital Organisasi Mapala IBN

Website organisasi **Mahasiswa Pecinta Alam NUSAPALA (Institut Bisnis Nusantara)**:
beranda publik, registrasi akun anggota, portal admin (kas, inventaris alat,
peminjaman, agenda, operasional lapangan), halaman cuaca gunung, serta API kartu
tanda anggota (KTA) berbasis QR.

---

## Struktur Proyek

```
nusapala-verifikasi/
├── api/kartu.js              # Endpoint kartu anggota / verify (Vercel Function)
├── public/
│   ├── index.html            # Beranda publik (agenda, galeri, seksi divisi, transparansi)
│   ├── registrasi.html       # Pendaftaran akun anggota baru
│   ├── admin.html            # Portal Admin (login + seluruh modul manajemen)
│   ├── cuaca-gunung.html     # Prakiraan cuaca gunung (Open-Meteo)
│   ├── js/                   # gunung-database.js, weather-service.js
│   ├── Logo Nusapala.png, robots.txt, sitemap.xml
├── package.json
└── vercel.json               # cleanUrls + rewrite /verify → /api/kartu
```

## Halaman & Akses

| URL | Keterangan |
| --- | --- |
| `/` | Beranda publik: agenda, galeri, **seksi Divisi**, transparansi kas & inventaris |
| `/registrasi` | Pendaftaran akun anggota (divisi dipilih dari master data) |
| `/admin` | Portal Admin (Super Admin / Admin / Pengurus / Alumni read-only) |
| `/cuaca-gunung` | Cuaca live gunung-gunung Indonesia |
| `/verify` | Endpoint kartu anggota (QR KTA) |

Deploy: **Vercel** (static + serverless function). Pengaturan rewrite ada di `vercel.json`.

---

## Data Divisi (Master Data)

Tiga divisi standar otomatis diselaraskan ke tabel `settings` (key `kategori_divisi`):

1. **Gunung Hutan**
2. **Rock Climbing**
3. **Olahraga Arus Deras** (alias lama `Rafting/Orad` dimigrasikan otomatis)

Master data ini dipakai oleh: halaman Pengaturan, filter Database Anggota,
formulir Registrasi, dropdown Agenda, dan Operasional Lapangan.

Menambah/mengubah divisi: **Portal Admin → Pengaturan → Data Divisi**
(tombol **Tambah** atau tekan **Enter** pada kolom isian). Bisa juga menyimpan
divisi tambahan di luar tiga divisi standar; divisi tersebut tetap didukung
ikon & warna otomatis.

---

## Riwayat Pembaruan — 13 Oktober 2026

**1. Perbaikan data divisi (bug utama)**
- Tiga divisi standar (Gunung Hutan, Rock Climbing, Olahraga Arus Deras) kini
  diselaraskan otomatis ke database lewat migrasi bertanda versi
  (`divisi_schema_version`), idempoten — tidak menulis ulang bila tidak berubah.
- Nama lama `Rafting/Orad` dimigrasikan ke `Olahraga Arus Deras` (di master data
  dan pada perhitungan/penyaringan divisi).
- **Perbaikan tombol "Tambah" divisi yang tidak berfungsi**: blok Data Divisi
  sebelumnya berada di dalam `<div>` Kategori Surat (HTML tidak valid) sehingga
  input tidak dapat dipakai. Blok kini dipisah dan selalu aktif.
- Kolom divisi tidak lagi hilang saat mengedit anggota yang memakai nama divisi
  lama (opsi cadangan otomatis disediakan).
- Menambah divisi tidak lagi gagal tanpa penjelasan: ada validasi duplikat,
  pesan input kosong, indikator loading, dan pembatalan otomatis jika penyimpanan
  ke database gagal.
- Halaman Registrasi tidak lagi menampilkan "Gagal memuat data Divisi" ketika
  baris `kategori_divisi` belum ada (memakai `maybeSingle()` + daftar divisi standar).

**2. Perbaikan kontras teks ("teks menyatu dengan background")**
- Badge/chip `bg-*-subtle` (peringatan, info, sukses) memakai tinta yang lebih
  gelap — lolos WCAG 2.1 AA.
- Label kategori di halaman Pengaturan kembali berwarna sesuai konteks (sebelumnya
  semua abu-abu karena tertimpa `!important`).
- Teks sekunder, timestamp notifikasi, label sidebar, placeholder formulir,
  dan ikon checklist password dinaikkan kontrasnya di admin, registrasi,
  beranda, dan halaman cuaca.

**3. Fitur baru**
- **Kartu "Sebaran Divisi Anggota"** di dashboard (jumlah anggota + persentase
  per divisi).
- **Kolom Divisi + filter divisi** pada Database Anggota.
- **Seksi "Divisi Nusapala"** di beranda publik (ikon, deskripsi, jumlah anggota).
- **Animasi angka (count-up)** pada kartu statistik dashboard.
- Tombol **"Muat ulang divisi standar"** di Pengaturan.
- Transisi antar halaman, animasi baris tabel, dan dukungan `prefers-reduced-motion`.

**4. Perbaikan bug lain**
- Kartu "Total Anggota" pada dashboard tidak pernah ter-update karena salah ketik
  id (`dashanggota` → `dashAnggota`).
- Log error sinkronisasi kini tampil di console (memudahkan pelaporan masalah).
- Navigasi sidebar tidak lagi error saat label menu belum ter-render.

**5. Keamanan (penting)**
- **Password kini benar-benar diverifikasi saat login.** Sebelumnya nilai password
  diambil dari form tetapi tidak pernah dibandingkan, sehingga siapa pun yang
  mengetahui Nomor Angkatan dapat masuk ke Portal Admin. Lihat `REKOMENDASI.md`
  untuk langkah pengamanan lanjutan (kunci Supabase, RLS, hashing password).

**6. Perbaikan menyeluruh "gabisa masukin divisi" (laporan pengguna, putaran 2)**
- **Izin diperjelas & dilonggarkan secara aman**: selain Super Admin/Admin, akun
  non-Admin yang **secara eksplisit diberi akses halaman Pengaturan** kini boleh
  menambah/mengubah/menghapus divisi. Alumni tetap read-only (diblokir di inti
  izin, termasuk sinkronisasi latar).
- **UI konsisten dengan izin**: bila pengguna tidak berhak, kolom isian & tombol
  *Tambah* langsung **dinonaktifkan** disertai catatan yang menjelaskan role
  saat ini dan cara memperbaikinya. (Sebelumnya kolom terlihat aktif lalu
  ditolak saat diklik — pengurus mengira fiturnya rusak.)
- **Penyimpanan lebih tahan gagal**: `upsertSetting` kini punya jalur cadangan
  (update-by-key → insert) bila `upsert(onConflict: 'key')` ditolak karena
  tabel `settings` tidak punya unique constraint pada kolom `key`.
- **Kegagalan tulis (RLS/jaringan) transparan**: dialog berisi pesan error
  asli + langkah memperbaikinya, teks yang diketik pengguna **dikembalikan**,
  data lokal di-*rollback*, dan detail lengkap dicatat di console browser.
- **Divisi baru langsung terlihat**: baris baru otomatis di-*scroll* ke tampilan
  dan disorot dengan animasi emas (menghormati `prefers-reduced-motion`);
  toast sukses 2,4 detik. Baris sebelumnya memang ditambahkan di **paling
  bawah** daftar yang bisa di-scroll — mudah terlewat sehingga terasa "gagal".
- **Anti cache basi**: `vercel.json` kini menetapkan
  `Cache-Control: public, max-age=0, must-revalidate` agar browser selalu
  memuat `admin.html` terbaru (versi lama yang rusak tidak tertinggal di cache).
- **Null-safety**: `checkAlumni` & render Pengaturan tidak lagi error saat
  sesi login kadaluarsa/tersingkir.

> ⚠️ **Catatan pemulihan**: bila Anda tidak dapat login setelah pembaruan ini,
> perbarui kolom `password` pada tabel `members` di dashboard Supabase untuk akun
> Anda, contoh:
> ```sql
> update members set password = 'GantiSegera123'
> where "Nomor Angkatan" = 'N 3126 - 193 AM';
> ```

---

## Lihat Juga

- `REKOMENDASI.md` — daftar saran pengembangan (fitur, tampilan, animasi, keamanan).
