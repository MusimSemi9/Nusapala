# Saran Pengembangan Nusapala

Hasil tinjauan kode & tampilan (13 Okt 2026). Disusun berurutan dari yang
paling mendesak.

---

## 🔴 Prioritas 1 — Keamanan (segera)

1. **Ganti kunci Supabase di sisi frontend.**
   Kunci yang tertanam di `admin.html`, `index.html`, dan `registrasi.html`
   bertipe **`service_role`** (bukan `anon`). Kunci ini melewati seluruh aturan
   RLS, sehingga siapa pun yang membuka *View Source* dapat membaca/menghapus
   seluruh database.
   - Buat kunci `anon`, aktifkan **Row Level Security** + policy per tabel.
   - Pindahkan operasi tulis sensitif (approve anggota, hapus kas) ke
     serverless function seperti `api/kartu.js`.
   - Putar ulang (rotate) kunci lama setelah diganti.
2. **Hash password anggota.** Saat ini password disimpan apa adanya
   (default anggota baru: `123456`). Minimal gunakan `bcrypt`/`argon2` melalui
   function, idealnya migrasi ke **Supabase Auth** (login via sesi/JWT).
3. **Batasi ekspor data.** Tambahkan konfirmasi + catatan audit (siapa mengunduh
   data apa) untuk ekspor database anggota.

> Sudah diperbaiki pada pembaruan ini: login kini **memverifikasi password**
> (sebelumnya tidak pernah dibandingkan sama sekali).

## 🟠 Prioritas 2 — Fitur yang paling sering dibutuhkan pengurus

4. **Notifikasi jatuh tempo**: pengingat kas bulanan (WhatsApp/email) dan
   pengingat pengembalian alat yang lewat tenggat.
5. **Ekspor laporan** kas & inventaris ke Excel/PDF per bulan
   (`papaparse` sudah ada di `package.json` tetapi belum dipakai).
6. **Riwayat/audit log** aksi admin (tambah kas, hapus anggota, ubah alat).
7. **Peminjaman alat**: bukti serah-terima dengan tanda tangan/foto + QR alat
   (QR KTA sudah ada, tinggal dipakai ulang polanya).
8. **Surat menyurat**: nomor surat otomatis + template surat siap cetak (PDF).
9. **Galeri**: unggah foto langsung ke Supabase Storage (saat ini masih input URL).
10. **Kalender publik (.ics)** agar agenda bisa disinkronkan ke Google Calendar
    anggota.

## 🟡 Prioritas 3 — Tampilan & UX

11. **Mode gelap** untuk Portal Admin (toggle, tersimpan di LocalStorage).
12. **Pencarian global (Ctrl + K)** untuk cepat menuju anggota/alat/kegiatan.
13. **Pagination + header tabel menempel** pada tabel besar (Database Anggota, Kas).
14. **Kartu profil anggota** (foto, riwayat kegiatan, status iuran) sebagai
    ringkasan saat baris anggota diklik.
15. **Mobile bottom-navigation** di admin — saat ini semua menu ada di sidebar.
16. **Empty state & skeleton** konsisten di seluruh modul (sebagian sudah ada).
17. **Badge status berwarna** yang seragam di semua modul (sudah sebagian
    diseragamkan agar kontrasnya aman).

## 🟢 Prioritas 4 — Animasi & detail kecil

18. Animasi transisi halaman, baris tabel, dan angka statistik — **sudah
    ditambahkan** pada pembaruan ini (dengan dukungan `prefers-reduced-motion`).
19. Animasi grafik dashboard yang tumbuh saat halaman dibuka.
20. Efek *hover-lift* pada kartu divisi & kartu statistik (sudah ada, bisa
    diperluas ke kartu agenda).
21. Konfeti/ilustrasi singkat saat menyimpan data penting (mis. approve anggota)
    — opsional, cukup untuk kesan "hidup".

## 🔵 Prioritas 5 — Data & operasional

22. **Normalisasi data divisi lama** pada tabel `members`
    (`Rafting/Orad` → `Olahraga Arus Deras`) — bisa dijalankan sekali:
    ```sql
    update members set "Divisi" = 'Olahraga Arus Deras'
    where "Divisi" in ('Rafting/Orad','ORAD','Rafting');
    ```
23. **Backup harian** otomatis (Supabase scheduled backup / ekspor rutin).
24. **Validasi format NPA** saat pendaftaran agar tidak ada NPA ganda/typo.
25. **PWA/offline mode** untuk kegiatan lapangan (halaman cuaca & checklist alat
    tetap terbuka tanpa sinyal).
26. **Panel "integritas data"** di Pengaturan: mendeteksi anggota tanpa divisi,
    alat tanpa kategori, kas tanpa kategori, dsb.
