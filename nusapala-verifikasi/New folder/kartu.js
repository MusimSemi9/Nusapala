const Papa = require('papaparse');

// Ganti dengan URL CSV hasil "Publish to web" dari Google Sheets kamu.
// Format URL biasanya: https://docs.google.com/spreadsheets/d/e/XXXXX/pub?output=csv
const SHEET_CSV_URL = process.env.SHEET_CSV_URL || 'PASTE_CSV_URL_DISINI';

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  const { id } = req.query;

  if (!id) {
    return res.status(200).send(renderCard(false));
  }

  if (SHEET_CSV_URL === 'PASTE_CSV_URL_DISINI') {
    return res.status(500).send('<h2>SHEET_CSV_URL belum di-set.</h2>');
  }

  try {
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) {
      throw new Error('Gagal fetch CSV, status: ' + response.status);
    }
    const csvText = await response.text();
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

    if (!parsed.data.length) {
      return res.status(200).send(renderCard(false));
    }

    const headers = Object.keys(parsed.data[0]);
    const nomorAngkatanKey = headers.find((k) => k.includes('Nomor Angkatan'));
    const namaAngkatanKey = headers.find((k) => k.includes('Nama Angkatan'));

    const row = parsed.data.find(
      (r) => String(r[nomorAngkatanKey] || '').trim() === String(id).trim()
    );

    if (!row) {
      return res.status(200).send(renderCard(false));
    }

    return res.status(200).send(
      renderCard(true, {
        nama: row['Nama Lengkap'],
        nomorAngkatan: row[nomorAngkatanKey],
        namaAngkatan: row[namaAngkatanKey],
        jenisKartu: row['Jenis Kartu Uang Elektronik'],
        timestamp: row['Timestamp'],
      })
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send('<h2>Terjadi kesalahan saat memuat data.</h2>');
  }
};

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderCard(found, data = {}) {
  const body = found
    ? `
    <div class="card">
      <div class="header">
        <div>
          <div class="label">NUSAPALA &middot; Kartu Anggota Digital</div>
          <div class="title">Verifikasi Keanggotaan</div>
        </div>
        <div class="badge"><span class="dot"></span> Terverifikasi</div>
      </div>

      <div class="name">${escapeHtml(data.nama)}</div>
      <div class="angkatan-name">${escapeHtml(data.namaAngkatan)}</div>

      <div class="divider"></div>

      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Nomor Angkatan</div>
          <div class="info-value">${escapeHtml(data.nomorAngkatan)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Kartu E-Money</div>
          <div class="info-value">${escapeHtml(data.jenisKartu)}</div>
        </div>
      </div>

      <div class="footer">
        <span>Terdaftar: ${escapeHtml(data.timestamp)}</span>
        <span>ID: ${escapeHtml(data.nomorAngkatan)}</span>
      </div>
    </div>`
    : `
    <div class="not-found">
      <div class="icon">&#9888;&#65039;</div>
      <h2>Data Tidak Ditemukan</h2>
      <p>QR code tidak valid atau nomor angkatan tidak terdaftar dalam sistem. Silakan hubungi panitia untuk konfirmasi.</p>
    </div>`;

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Verifikasi Anggota NUSAPALA</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at top, #14210f 0%, #060a05 100%);
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    padding: 24px;
  }
  .card {
    width: 100%;
    max-width: 380px;
    background: linear-gradient(150deg, #0f2e1a 0%, #10331d 45%, #0a0a0a 100%);
    border: 1px solid rgba(250,204,21,0.25);
    border-radius: 20px;
    padding: 28px 26px 24px;
    color: #f5f5f0;
    box-shadow: 0 20px 45px rgba(0,0,0,0.55);
    position: relative;
    overflow: hidden;
  }
  .card::before {
    content: "";
    position: absolute;
    top: -70px; right: -70px;
    width: 180px; height: 180px;
    background: radial-gradient(circle, rgba(250,204,21,0.10) 0%, rgba(250,204,21,0) 70%);
    border-radius: 50%;
  }
  .card::after {
    content: "";
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 6px;
    background: linear-gradient(90deg, #16a34a 0%, #facc15 50%, #16a34a 100%);
  }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 22px; position: relative; z-index: 1; }
  .header .label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #facc15; opacity: 0.9; }
  .header .title { font-size: 17px; font-weight: 700; margin-top: 4px; }
  .badge { display: flex; align-items: center; gap: 5px; background: rgba(250,204,21,0.15); border: 1px solid rgba(250,204,21,0.55); color: #fde68a; font-size: 11px; font-weight: 600; padding: 5px 10px; border-radius: 999px; white-space: nowrap; }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: #facc15; }
  .name { position: relative; z-index: 1; font-size: 24px; font-weight: 700; margin-bottom: 4px; line-height: 1.25; color: #ffffff; }
  .angkatan-name { position: relative; z-index: 1; font-size: 14px; color: #86efac; margin-bottom: 22px; }
  .divider { height: 1px; background: linear-gradient(90deg, rgba(22,163,74,0.6), rgba(250,204,21,0.5), rgba(22,163,74,0.6)); margin: 18px 0; position: relative; z-index: 1; }
  .info-grid { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .info-item .info-label { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #facc15; opacity: 0.75; margin-bottom: 4px; }
  .info-item .info-value { font-size: 14px; font-weight: 600; color: #f5f5f0; }
  .footer { position: relative; z-index: 1; margin-top: 22px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #a3a3a3; }
  .not-found { max-width: 360px; background: #0f2e1a; border: 1px solid rgba(250,204,21,0.25); color: #f5f5f0; border-radius: 18px; padding: 36px 28px; text-align: center; box-shadow: 0 20px 45px rgba(0,0,0,0.55); }
  .not-found .icon { font-size: 40px; margin-bottom: 14px; }
  .not-found h2 { font-size: 17px; margin-bottom: 8px; }
  .not-found p { font-size: 13px; opacity: 0.7; line-height: 1.5; }
</style>
</head>
<body>
${body}
</body>
</html>`;
}