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
├── tests/                    # pengujian otomatis (jsdom + Supabase tiruan)
├── package.json              # npm test → tests/run-all.js
└── vercel.json               # cleanUrls + rewrite /verify → /api/kartu
```

## Pengujian

```bash
cd nusapala-verifikasi
npm install     # sekali saja
npm test        # 73 pengujian: divisi, halaman publik, 10 halaman admin, sintaks
```

Tidak perlu internet maupun database asli — lihat `nusapala-verifikasi/tests/README.md`.

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

Nama divisi disimpan **persis seperti yang diketik**. Bila nama yang dimasukkan
sama dengan penulisan lama divisi standar (mis. *Panjat Tebing* untuk Rock
Climbing, atau *Rafting*/*ORAD* untuk Olahraga Arus Deras), sistem bertanya
dahulu sebelum menyimpannya sebagai divisi terpisah — tidak lagi hilang diam-diam.

Kolom **Divisi / Lokasi** pada Agenda dan **Kategori / Divisi** pada Galeri
terhubung ke master data ini (datalist), jadi bisa dipilih tanpa mengetik manual.

---

## Riwayat Pembaruan — 13 Oktober 2026 (tahap 2)

**Perbaikan bug: divisi baru tidak bisa masuk**

Gejala: nama divisi diketik → tombol **Tambah** diklik → muncul *"Tersimpan"*,
tetapi divisi tidak pernah muncul di daftar dan hilang lagi setelah halaman
dimuat ulang.

Penyebab: pemetaan penulisan lama (`DIVISI_ALIAS`) diterapkan pada **master
data** setiap kali daftar divisi dibersihkan. Nama seperti `Panjat Tebing`,
`Rafting`, `ORAD`, `Arus Deras`, dan `Rockclimbing` otomatis diganti ke nama
divisi standar lalu dibuang sebagai duplikat — **setelah** notifikasi sukses
tampil. Jadi penyimpanannya "berhasil", tetapi hasilnya langsung dihapus.

Yang diubah:

- Alias penulisan lama kini hanya dipakai untuk **migrasi sekali jalan**
  (`divisi_schema_version` dinaikkan ke **3**) dan untuk **menafsirkan data
  lama pada tabel `members`** (`Rafting/Orad` tetap terhitung sebagai Olahraga
  Arus Deras). Master data tidak pernah diubah diam-diam lagi.
- `addKategoriItem()` memverifikasi hasilnya setelah daftar dirender ulang.
  Bila namanya ternyata tidak bertahan, perubahan dibatalkan dan muncul pesan
  **"Tidak Bisa Disimpan"** — tidak ada lagi notifikasi sukses palsu.
- Menambah nama yang sama artinya dengan divisi standar memunculkan konfirmasi
  *"Nama Ini Mirip Divisi Lama"* dengan pilihan **Ya, tambahkan** / **Batal**.
- Divisi yang baru ditambahkan **disorot + digulirkan ke tampilan** agar
  perubahan benar-benar terlihat.
- `upsertSetting()` punya **jalur cadangan** (select → update/insert) bila kolom
  `key` pada tabel `settings` tidak punya UNIQUE constraint — penyebab lain
  semua master data gagal disimpan (error Postgres `42P10`).
- Pesan **Akses Ditolak** kini menjelaskan cara memperoleh hak akses (role akun
  harus dinaikkan menjadi Admin oleh Super Admin), bukan sekadar menolak.
- Validasi tambahan: nama kosong, duplikat (termasuk beda spasi/huruf besar),
  dan maksimal 60 karakter.
- Perbaikan yang sama diterapkan di **halaman Registrasi** (divisi tambahan
  tidak hilang lagi dari dropdown) dan **beranda publik** (jumlah anggota tidak
  "dicuri" oleh divisi lain).
- Klik ganda pada tombol **Tambah** tidak lagi memicu dua kali simpan.

Seluruh perbaikan diverifikasi dengan 73 pengujian otomatis (jsdom + mock
Supabase): penambahan 9 nama divisi berbeda, migrasi data lama, ketahanan
setelah pindah halaman, kegagalan database, hak akses per role, validasi input,
rename/hapus divisi, serta smoke test 10 halaman Portal Admin.

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
- `nusapala-verifikasi/tests/README.md` — cara menjalankan & isi pengujian otomatis.
