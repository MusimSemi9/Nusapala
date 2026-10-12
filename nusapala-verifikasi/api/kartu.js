const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ciqefdklecqgzczmzyde.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpcWVmZGtsZWNxZ3pjem16eWRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTI1OTkwNiwiZXhwIjoyMTAwODM1OTA2fQ.aYGy_SUjUbRUG73TPWdtGKM9B3OL05QK4Xc-gsUfCbk';

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  // Bungkus SEMUANYA (termasuk require & init client) dalam try/catch paling luar.
  // Kalau ada apapun yang gagal, user tetap lihat halaman "tidak ditemukan" custom,
  // bukan halaman crash 500 bawaan Vercel.
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { id } = req.query;

    if (!id || !String(id).trim()) {
      return res.status(200).send(renderPage(false, null, 'ID Angkatan tidak boleh kosong.'));
    }

    let cleanId = String(id || '').trim();
      try {
        if (cleanId.includes('%')) {
          cleanId = decodeURIComponent(cleanId).trim();
        }
      } catch (e) {
        cleanId = String(id).trim();
      }

    // Gunakan .ilike agar fleksibel mencari ID Angkatan meskipun ada beda spasi/huruf
    const { data: rows, error } = await supabase
      .from('members')
      .select('*')
      .ilike('Nomor Angkatan', `%${cleanId}%`);

    if (error) {
      console.error('Supabase Query Error:', error);
      return res.status(200).send(renderPage(false, null, 'Terjadi kesalahan sistem saat membaca database.'));
    }

    if (!rows || rows.length === 0) {
      return res.status(200).send(renderPage(false, cleanId));
    }

    const row = rows[0];

    return res.status(200).send(
      renderPage(true, cleanId, {
        nama: row['Nama Lengkap'] || '-',
        nomorAngkatan: row['Nomor Angkatan'] || '-',
        namaAngkatan: row['Nama Angkatan'] || '-',
        ttl: row['Tanggal Lahir'] || '-',
        divisi: row['Divisi'] || '-',
        jenisKartu: row['Jenis Kartu'] || '-',
        timestamp: row['Timestamp'] || '-',
        fotoUrl: row['Upload Foto'] ? drivePhotoUrl(row['Upload Foto']) : null,
      })
    );
  } catch (err) {
    console.error('Server Error:', err);
    return res.status(200).send(renderPage(false, null, 'Terjadi kendala teknis pada server.'));
  }
};

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function extractDriveFileId(url) {
  if (!url) return null;
  const patterns = [/\/file\/d\/([a-zA-Z0-9_-]+)/, /[?&]id=([a-zA-Z0-9_-]+)/, /\/d\/([a-zA-Z0-9_-]+)/];
  for (const p of patterns) {
    const m = String(url).match(p);
    if (m) return m[1];
  }
  return null;
}

function drivePhotoUrl(url) {
  const id = extractDriveFileId(url);
  if (!id) return null;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w400`;
}

function initials(nama = '') {
  return nama
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function renderPage(found, searchedId = '', data = {}) {
  const cardHtml = found 
    ? renderFoundCard(data) 
    : renderNotFoundCard(searchedId, typeof data === 'string' ? data : null);

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Verifikasi Anggota NUSAPALA</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --color-green: #112A1C;
    --color-black: #0A0F0D;
    --color-gold: #C5A059;
    --color-gold-light: #DFCDA5;
    --color-white: #FFFFFF;
    --color-bg: #F4F6F5;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg);
    font-family: 'Montserrat', sans-serif;
    padding: 24px;
    color: var(--color-black);
  }
  .page { width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 24px; }
  
  /* CARD VERIFIED */
  .card {
    width: 100%;
    background: linear-gradient(135deg, var(--color-green) 0%, var(--color-black) 100%);
    border: 1px solid rgba(197, 160, 89, 0.3);
    border-radius: 20px;
    padding: 32px 28px 28px;
    box-shadow: 0 24px 48px rgba(10, 15, 13, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
    color: var(--color-white);
  }
  .card::before {
    content: "";
    position: absolute;
    top: -60px; right: -60px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(197, 160, 89, 0.15) 0%, rgba(197, 160, 89, 0) 70%);
    border-radius: 50%;
    z-index: 0;
  }
  .card::after {
    content: "";
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-green) 0%, var(--color-gold) 50%, var(--color-green) 100%);
  }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; position: relative; z-index: 1; }
  .header-left { display: flex; align-items: center; gap: 14px; }
  .logo { 
     width: 44px; height: 44px; 
     object-fit: contain; 
     border-radius: 8px; 
     background: rgba(255, 255, 255, 0.05); 
     padding: 4px; 
     border: 1px solid rgba(197, 160, 89, 0.3);
  }
  .header .label { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--color-gold-light); }
  .header .title { font-size: 15px; font-weight: 700; color: var(--color-white); margin-top: 2px; letter-spacing: 0.5px; }
  .badge { 
     display: flex; align-items: center; gap: 6px; 
     background: rgba(197, 160, 89, 0.1); 
     border: 1px solid var(--color-gold); 
     color: var(--color-gold); 
     font-size: 10px; font-weight: 700; 
     padding: 6px 12px; 
     border-radius: 999px; 
     text-transform: uppercase; 
     letter-spacing: 1px;
  }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-gold); box-shadow: 0 0 8px var(--color-gold); }
  .profile-row { position: relative; z-index: 1; display: flex; align-items: center; gap: 18px; margin-bottom: 24px; }
  .avatar { 
     width: 76px; height: 76px; 
     border-radius: 50%; object-fit: cover; 
     border: 2px solid var(--color-gold); 
     box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); 
     background: var(--color-black); 
     flex-shrink: 0;
  }
  .avatar-fallback { 
     width: 76px; height: 76px; 
     border-radius: 50%; 
     border: 2px solid var(--color-gold); 
     background: var(--color-green); 
     display: flex; align-items: center; justify-content: center; 
     font-weight: 700; font-size: 24px; color: var(--color-gold); 
     flex-shrink: 0; 
     box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }
  .name { font-size: 20px; font-weight: 800; line-height: 1.25; color: var(--color-white); }
  .angkatan-name { font-size: 13px; font-weight: 500; color: var(--color-gold-light); margin-top: 4px; }
  .info-grid { 
     position: relative; z-index: 1; 
     display: grid; grid-template-columns: 1fr 1fr; gap: 14px; 
     background: rgba(255, 255, 255, 0.03); 
     border-radius: 12px; 
     padding: 16px; 
     border: 1px solid rgba(197, 160, 89, 0.2);
  }
  .info-item .info-label { font-size: 9px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--color-gold); margin-bottom: 4px; }
  .info-item .info-value { font-size: 13px; font-weight: 600; color: var(--color-white); word-break: break-word; }
  .motto { position: relative; z-index: 1; margin-top: 24px; text-align: center; }
  .motto-main { font-size: 11px; font-weight: 600; color: var(--color-white); letter-spacing: 0.5px; }
  .motto-sub { font-size: 9px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--color-gold); margin-top: 6px; opacity: 0.9; }
  .footer { 
     position: relative; z-index: 1; 
     margin-top: 24px; padding-top: 14px; 
     border-top: 1px dashed rgba(197, 160, 89, 0.3); 
     display: flex; justify-content: space-between; align-items: center; 
     font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.5); 
     text-transform: uppercase; letter-spacing: 1px;
  }

  /* CARD NOT FOUND */
  .not-found { 
     background: var(--color-white); 
     border: 1px solid rgba(220, 38, 38, 0.2); 
     border-radius: 20px; 
     padding: 36px 28px; 
     text-align: center; 
     box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06); 
  }
  .not-found .icon-badge {
     width: 64px; height: 64px;
     background: #FEF2F2;
     border: 2px solid #FCA5A5;
     border-radius: 50%;
     display: flex; align-items: center; justify-content: center;
     margin: 0 auto 20px;
     color: #DC2626;
     font-size: 28px;
  }
  .not-found h2 { font-size: 18px; font-weight: 800; color: #991B1B; margin-bottom: 8px; }
  .not-found p { font-size: 13px; font-weight: 500; color: #6B7280; line-height: 1.6; margin-bottom: 20px; }
  .searched-tag {
     display: inline-block;
     background: #F3F4F6;
     border: 1px solid #E5E7EB;
     color: #374151;
     font-size: 11px;
     font-weight: 700;
     padding: 6px 14px;
     border-radius: 8px;
     margin-bottom: 20px;
     word-break: break-all;
  }
  .btn-group { display: flex; flex-direction: column; gap: 10px; }
  .btn-primary {
     background: var(--color-green);
     color: var(--color-white);
     text-decoration: none;
     font-size: 12px;
     font-weight: 700;
     padding: 12px 20px;
     border-radius: 12px;
     transition: all 0.2s;
  }
  .btn-primary:hover { background: var(--color-black); }

  /* INFO PANEL */
  .info-panel {
    background: var(--color-white);
    border: 1px solid rgba(17, 42, 28, 0.1);
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  }
  .info-panel h3 { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: var(--color-gold); margin-bottom: 16px; }
  .info-panel .campus { font-size: 14px; font-weight: 700; margin-bottom: 8px; color: var(--color-green); }
  .info-panel p { font-size: 12px; font-weight: 500; line-height: 1.6; color: #444; margin-bottom: 6px; }
  .info-panel a { color: var(--color-green); text-decoration: none; font-weight: 700; }
  .info-panel a:hover { text-decoration: underline; color: var(--color-gold); }
  .ig-link { 
     display: inline-flex; align-items: center; gap: 8px; 
     margin-top: 20px; padding: 12px 20px; 
     background: var(--color-green); border-radius: 12px; 
     font-size: 12px; font-weight: 700; color: var(--color-white) !important; 
     text-decoration: none; transition: all 0.2s; 
     letter-spacing: 0.5px; 
  }
  .ig-link:hover { background: var(--color-black); transform: translateY(-2px); text-decoration: none !important; }
</style>
</head>
<body>
<div class="page">
  ${cardHtml}
  <div class="info-panel">
    <h3>Informasi Sekretariat</h3>
    <div class="campus">Institut Bisnis Nusantara</div>
    <p>Jl. Pulomas Timur 3A, Kayu Putih, Jakarta Timur</p>
    <p>Telepon: <a href="tel:021-4786-8800">021-4786-8800</a></p>
    <p>Mobile: <a href="tel:0819-3225-0010">0819-3225-0010</a></p>
    <p>Email: <a href="mailto:info@ibn.ac.id">info@ibn.ac.id</a></p>
    <a class="ig-link" href="https://www.instagram.com/nusapalaibn/" target="_blank" rel="noopener">@nusapalaibn</a>
  </div>
</div>
</body>
</html>`;
}

function renderFoundCard(data) {
  const avatar = data.fotoUrl
    ? `<img class="avatar" src="${escapeHtml(data.fotoUrl)}" alt="Foto ${escapeHtml(data.nama)}">`
    : `<div class="avatar-fallback">${escapeHtml(initials(data.nama))}</div>`;

  return `
    <div class="card">
      <div class="header">
        <div class="header-left">
          <img class="logo" src="/Logo Nusapala.png" alt="Logo NUSAPALA">
          <div>
            <div class="label">NUSAPALA</div>
            <div class="title">Member Card</div>
          </div>
        </div>
        <div class="badge"><span class="dot"></span> Verified</div>
      </div>
      <div class="profile-row">
        ${avatar}
        <div>
          <div class="name">${escapeHtml(data.nama)}</div>
          <div class="angkatan-name">${escapeHtml(data.namaAngkatan)}</div>
        </div>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">ID Angkatan</div>
          <div class="info-value">${escapeHtml(data.nomorAngkatan)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Divisi</div>
          <div class="info-value">${escapeHtml(data.divisi)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Tanggal Lahir</div>
          <div class="info-value">${escapeHtml(data.ttl)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Kartu Akses</div>
          <div class="info-value">${escapeHtml(data.jenisKartu)}</div>
        </div>
      </div>
      <div class="motto">
        <div class="motto-main">Patriotisme, Persaudaraan, Kekompakan</div>
        <div class="motto-sub">Adventure &middot; Learn &middot; Explore &middot; Protect</div>
      </div>
      <div class="footer">
        <span>Reg: ${escapeHtml(data.timestamp).split(' ')[0]}</span>
        <span>Valid Member</span>
      </div>
    </div>`;
}

function renderNotFoundCard(searchedId, customMsg) {
  const tag = searchedId ? `<div class="searched-tag">ID: "${escapeHtml(searchedId)}"</div>` : '';
  const message = customMsg || 'QR code tidak valid atau nomor ID Angkatan tidak ditemukan di dalam database NUSAPALA.';

  return `
    <div class="not-found">
      <div class="icon-badge">⚠️</div>
      <h2>Data Tidak Ditemukan</h2>
      <p>${escapeHtml(message)}</p>
      ${tag}
      <div class="btn-group">
        <a href="/" class="btn-primary">Kembali ke Halaman Utama</a>
      </div>
    </div>`;
}