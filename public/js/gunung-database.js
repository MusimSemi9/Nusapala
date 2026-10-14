/**
 * ============================================================================
 * NUSAPALA — Database Referensi Gunung Indonesia
 * ============================================================================
 * File ini HANYA berisi data referensi statis (nama, lokasi, ketinggian,
 * koordinat, status, jalur pendakian). Data ini wajar untuk disimpan statis
 * karena tidak berubah setiap saat seperti data cuaca.
 *
 * DATA CUACA TIDAK ADA DI FILE INI. Cuaca diambil live per-permintaan oleh
 * js/weather-service.js dari API Open-Meteo berdasarkan koordinat (lat/lon)
 * pada setiap entri di bawah.
 *
 * Cakupan: kurator ~65 gunung populer/utama di Indonesia lintas pulau besar
 * (Sumatra, Jawa, Bali, Nusa Tenggara, Kalimantan, Sulawesi, Maluku, Papua).
 * Ini BUKAN daftar lengkap seluruh gunung di Indonesia (jumlahnya ribuan
 * termasuk bukit-bukit kecil) — melainkan gunung-gunung yang umum dikenal
 * dan/atau menjadi tujuan pendakian. Koordinat disusun dari referensi publik
 * (Wikipedia, PVMBG, literatur pendakian) dengan akurasi terbaik yang wajar;
 * silakan koreksi/lengkapi entri jika ditemukan ketidakakuratan.
 *
 * Struktur field:
 *  id           : slug unik
 *  nama         : nama gunung
 *  provinsi     : provinsi (bisa lebih dari satu, dipisah " / ")
 *  kabupaten    : kabupaten/kota utama
 *  pulau        : pulau/kepulauan
 *  ketinggian   : mdpl (angka)
 *  lat, lon     : koordinat puncak (desimal)
 *  status       : "Berapi Aktif" | "Berapi Tidak Aktif" | "Non-Vulkanik"
 *  jalur        : jalur pendakian utama (jika diketahui), null jika tidak ada
 * ============================================================================
 */
window.GUNUNG_DATABASE = [
  // ---------------- SUMATRA ----------------
  { id: "kerinci", nama: "Gunung Kerinci", provinsi: "Jambi / Sumatera Barat", kabupaten: "Kerinci", pulau: "Sumatra", ketinggian: 3805, lat: -1.6975, lon: 101.2642, status: "Berapi Aktif", jalur: "Kersik Tuo" },
  { id: "leuser", nama: "Gunung Leuser", provinsi: "Aceh", kabupaten: "Gayo Lues", pulau: "Sumatra", ketinggian: 3119, lat: 3.7167, lon: 97.1667, status: "Non-Vulkanik", jalur: "Kedah / Kappi" },
  { id: "dempo", nama: "Gunung Dempo", provinsi: "Sumatera Selatan", kabupaten: "Pagar Alam", pulau: "Sumatra", ketinggian: 3173, lat: -4.0300, lon: 103.1300, status: "Berapi Aktif", jalur: "Kebun Kopi Pagar Alam" },
  { id: "marapi", nama: "Gunung Marapi", provinsi: "Sumatera Barat", kabupaten: "Agam / Tanah Datar", pulau: "Sumatra", ketinggian: 2891, lat: -0.3817, lon: 100.4733, status: "Berapi Aktif", jalur: "Koto Baru (ditutup sementara pasca-erupsi)" },
  { id: "singgalang", nama: "Gunung Singgalang", provinsi: "Sumatera Barat", kabupaten: "Agam / Tanah Datar", pulau: "Sumatra", ketinggian: 2877, lat: -0.3833, lon: 100.3500, status: "Berapi Tidak Aktif", jalur: "Pandai Sikek" },
  { id: "talang", nama: "Gunung Talang", provinsi: "Sumatera Barat", kabupaten: "Solok", pulau: "Sumatra", ketinggian: 2597, lat: -0.9783, lon: 100.6792, status: "Berapi Aktif", jalur: "Air Batumbuk" },
  { id: "tandikat", nama: "Gunung Tandikat", provinsi: "Sumatera Barat", kabupaten: "Padang Pariaman", pulau: "Sumatra", ketinggian: 2438, lat: -0.4333, lon: 100.3167, status: "Berapi Aktif", jalur: "Sungai Sariak" },
  { id: "sinabung", nama: "Gunung Sinabung", provinsi: "Sumatera Utara", kabupaten: "Karo", pulau: "Sumatra", ketinggian: 2460, lat: 3.1700, lon: 98.3928, status: "Berapi Aktif", jalur: "Ditutup untuk pendakian (status waspada)" },
  { id: "sibayak", nama: "Gunung Sibayak", provinsi: "Sumatera Utara", kabupaten: "Karo", pulau: "Sumatra", ketinggian: 2212, lat: 3.2192, lon: 98.5211, status: "Berapi Aktif", jalur: "Jaranguda / Semangat Gunung" },
  { id: "kaba", nama: "Gunung Kaba", provinsi: "Bengkulu", kabupaten: "Rejang Lebong", pulau: "Sumatra", ketinggian: 1952, lat: -3.5203, lon: 102.6172, status: "Berapi Aktif", jalur: "Sumber Urip" },
  { id: "pesagi", nama: "Gunung Pesagi", provinsi: "Lampung", kabupaten: "Lampung Barat", pulau: "Sumatra", ketinggian: 2262, lat: -5.0000, lon: 104.1500, status: "Berapi Tidak Aktif", jalur: "Hujung / Sukapura" },

  // ---------------- JAWA ----------------
  { id: "semeru", nama: "Gunung Semeru", provinsi: "Jawa Timur", kabupaten: "Lumajang / Malang", pulau: "Jawa", ketinggian: 3676, lat: -8.1077, lon: 112.9224, status: "Berapi Aktif", jalur: "Ranu Pani (dibatasi s.d. Kalimati)" },
  { id: "slamet", nama: "Gunung Slamet", provinsi: "Jawa Tengah", kabupaten: "Purbalingga / Banyumas / Pemalang / Tegal / Brebes", pulau: "Jawa", ketinggian: 3432, lat: -7.2425, lon: 109.2085, status: "Berapi Aktif", jalur: "Bambangan" },
  { id: "sumbing", nama: "Gunung Sumbing", provinsi: "Jawa Tengah", kabupaten: "Wonosobo / Temanggung", pulau: "Jawa", ketinggian: 3371, lat: -7.3833, lon: 110.0667, status: "Berapi Aktif", jalur: "Garung" },
  { id: "arjuno", nama: "Gunung Arjuno", provinsi: "Jawa Timur", kabupaten: "Malang / Pasuruan", pulau: "Jawa", ketinggian: 3339, lat: -7.7247, lon: 112.5897, status: "Berapi Aktif", jalur: "Tretes / Purwosari" },
  { id: "raung", nama: "Gunung Raung", provinsi: "Jawa Timur", kabupaten: "Banyuwangi / Bondowoso / Jember", pulau: "Jawa", ketinggian: 3344, lat: -8.1250, lon: 114.0417, status: "Berapi Aktif", jalur: "Kalibaru" },
  { id: "welirang", nama: "Gunung Welirang", provinsi: "Jawa Timur", kabupaten: "Malang / Pasuruan / Mojokerto", pulau: "Jawa", ketinggian: 3156, lat: -7.7333, lon: 112.5833, status: "Berapi Aktif", jalur: "Tretes" },
  { id: "merbabu", nama: "Gunung Merbabu", provinsi: "Jawa Tengah", kabupaten: "Magelang / Boyolali / Semarang", pulau: "Jawa", ketinggian: 3145, lat: -7.4550, lon: 110.4400, status: "Berapi Tidak Aktif", jalur: "Selo" },
  { id: "merapi", nama: "Gunung Merapi", provinsi: "Jawa Tengah / DI Yogyakarta", kabupaten: "Sleman / Magelang / Boyolali / Klaten", pulau: "Jawa", ketinggian: 2930, lat: -7.5407, lon: 110.4457, status: "Berapi Aktif", jalur: "Selo (dibatasi ketat, status Siaga)" },
  { id: "lawu", nama: "Gunung Lawu", provinsi: "Jawa Tengah / Jawa Timur", kabupaten: "Karanganyar / Magetan", pulau: "Jawa", ketinggian: 3265, lat: -7.6250, lon: 111.1917, status: "Berapi Tidak Aktif", jalur: "Cemoro Sewu" },
  { id: "ciremai", nama: "Gunung Ciremai", provinsi: "Jawa Barat", kabupaten: "Kuningan / Majalengka", pulau: "Jawa", ketinggian: 3078, lat: -6.8917, lon: 108.4083, status: "Berapi Aktif", jalur: "Linggarjati / Palutungan" },
  { id: "gede", nama: "Gunung Gede", provinsi: "Jawa Barat", kabupaten: "Cianjur / Sukabumi / Bogor", pulau: "Jawa", ketinggian: 2958, lat: -6.7833, lon: 106.9833, status: "Berapi Aktif", jalur: "Cibodas" },
  { id: "pangrango", nama: "Gunung Pangrango", provinsi: "Jawa Barat", kabupaten: "Cianjur / Sukabumi / Bogor", pulau: "Jawa", ketinggian: 3019, lat: -6.7667, lon: 106.9500, status: "Berapi Aktif", jalur: "Cibodas" },
  { id: "papandayan", nama: "Gunung Papandayan", provinsi: "Jawa Barat", kabupaten: "Garut", pulau: "Jawa", ketinggian: 2665, lat: -7.3200, lon: 107.7317, status: "Berapi Aktif", jalur: "Cisurupan" },
  { id: "guntur", nama: "Gunung Guntur", provinsi: "Jawa Barat", kabupaten: "Garut", pulau: "Jawa", ketinggian: 2249, lat: -7.1394, lon: 107.8394, status: "Berapi Aktif", jalur: "Citiis" },
  { id: "cikuray", nama: "Gunung Cikuray", provinsi: "Jawa Barat", kabupaten: "Garut", pulau: "Jawa", ketinggian: 2821, lat: -7.2117, lon: 107.7828, status: "Berapi Tidak Aktif", jalur: "Pemancar / Cilawu" },
  { id: "salak", nama: "Gunung Salak", provinsi: "Jawa Barat", kabupaten: "Bogor / Sukabumi", pulau: "Jawa", ketinggian: 2211, lat: -6.7167, lon: 106.7333, status: "Berapi Aktif", jalur: "Cimelati" },
  { id: "halimun", nama: "Gunung Halimun", provinsi: "Jawa Barat", kabupaten: "Bogor / Sukabumi / Lebak", pulau: "Jawa", ketinggian: 1929, lat: -6.7500, lon: 106.6667, status: "Berapi Tidak Aktif", jalur: "Citalahab" },
  { id: "burangrang", nama: "Gunung Burangrang", provinsi: "Jawa Barat", kabupaten: "Bandung Barat / Purwakarta", pulau: "Jawa", ketinggian: 2064, lat: -6.7717, lon: 107.5225, status: "Berapi Tidak Aktif", jalur: "Legok Haji" },
  { id: "tangkuban-perahu", nama: "Gunung Tangkuban Parahu", provinsi: "Jawa Barat", kabupaten: "Bandung Barat", pulau: "Jawa", ketinggian: 2084, lat: -6.7597, lon: 107.6094, status: "Berapi Aktif", jalur: "Kawasan Wisata (jalur resmi TWA)" },
  { id: "prau", nama: "Gunung Prau", provinsi: "Jawa Tengah", kabupaten: "Wonosobo / Batang / Kendal", pulau: "Jawa", ketinggian: 2565, lat: -7.1833, lon: 109.9167, status: "Berapi Tidak Aktif", jalur: "Patak Banteng" },
  { id: "sindoro", nama: "Gunung Sindoro", provinsi: "Jawa Tengah", kabupaten: "Wonosobo / Temanggung", pulau: "Jawa", ketinggian: 3153, lat: -7.3000, lon: 109.9917, status: "Berapi Aktif", jalur: "Kledung" },
  { id: "ungaran", nama: "Gunung Ungaran", provinsi: "Jawa Tengah", kabupaten: "Semarang", pulau: "Jawa", ketinggian: 2050, lat: -7.1833, lon: 110.3333, status: "Berapi Tidak Aktif", jalur: "Mawar / Promasan" },
  { id: "muria", nama: "Gunung Muria", provinsi: "Jawa Tengah", kabupaten: "Kudus / Jepara / Pati", pulau: "Jawa", ketinggian: 1602, lat: -6.6167, lon: 110.8833, status: "Berapi Tidak Aktif", jalur: "Rahtawu" },
  { id: "wilis", nama: "Gunung Wilis", provinsi: "Jawa Timur", kabupaten: "Madiun / Ponorogo / Kediri", pulau: "Jawa", ketinggian: 2563, lat: -7.8083, lon: 111.7667, status: "Berapi Tidak Aktif", jalur: "Bajulan" },
  { id: "kelud", nama: "Gunung Kelud", provinsi: "Jawa Timur", kabupaten: "Kediri / Blitar", pulau: "Jawa", ketinggian: 1731, lat: -7.9306, lon: 112.3083, status: "Berapi Aktif", jalur: "Tulungrejo (kawasan wisata)" },
  { id: "ijen", nama: "Gunung Ijen", provinsi: "Jawa Timur", kabupaten: "Banyuwangi / Bondowoso", pulau: "Jawa", ketinggian: 2799, lat: -8.0581, lon: 114.2425, status: "Berapi Aktif", jalur: "Paltuding" },
  { id: "argopuro", nama: "Gunung Argopuro", provinsi: "Jawa Timur", kabupaten: "Probolinggo / Situbondo", pulau: "Jawa", ketinggian: 3088, lat: -7.9750, lon: 113.5667, status: "Berapi Tidak Aktif", jalur: "Baderan" },
  { id: "penanggungan", nama: "Gunung Penanggungan", provinsi: "Jawa Timur", kabupaten: "Mojokerto / Pasuruan", pulau: "Jawa", ketinggian: 1653, lat: -7.6083, lon: 112.6250, status: "Berapi Tidak Aktif", jalur: "Tamiajeng" },

  // ---------------- BALI & NUSA TENGGARA ----------------
  { id: "agung", nama: "Gunung Agung", provinsi: "Bali", kabupaten: "Karangasem", pulau: "Bali", ketinggian: 3031, lat: -8.3425, lon: 115.5081, status: "Berapi Aktif", jalur: "Pasar Agung" },
  { id: "batur", nama: "Gunung Batur", provinsi: "Bali", kabupaten: "Bangli", pulau: "Bali", ketinggian: 1717, lat: -8.2425, lon: 115.3750, status: "Berapi Aktif", jalur: "Toya Bungkah" },
  { id: "rinjani", nama: "Gunung Rinjani", provinsi: "Nusa Tenggara Barat", kabupaten: "Lombok Timur / Lombok Utara", pulau: "Lombok", ketinggian: 3726, lat: -8.4108, lon: 116.4575, status: "Berapi Aktif", jalur: "Sembalun" },
  { id: "tambora", nama: "Gunung Tambora", provinsi: "Nusa Tenggara Barat", kabupaten: "Bima / Dompu", pulau: "Sumbawa", ketinggian: 2850, lat: -8.2500, lon: 118.0000, status: "Berapi Aktif", jalur: "Pancasila" },
  { id: "kelimutu", nama: "Gunung Kelimutu", provinsi: "Nusa Tenggara Timur", kabupaten: "Ende", pulau: "Flores", ketinggian: 1639, lat: -8.7583, lon: 121.8167, status: "Berapi Aktif", jalur: "Kawasan Wisata TN Kelimutu" },
  { id: "mutis", nama: "Gunung Mutis", provinsi: "Nusa Tenggara Timur", kabupaten: "Timor Tengah Selatan", pulau: "Timor", ketinggian: 2427, lat: -9.5667, lon: 124.2333, status: "Berapi Tidak Aktif", jalur: "Fatumnasi" },
  { id: "egon", nama: "Gunung Egon", provinsi: "Nusa Tenggara Timur", kabupaten: "Sikka", pulau: "Flores", ketinggian: 1703, lat: -8.6725, lon: 122.4525, status: "Berapi Aktif", jalur: "Blidit" },
  { id: "inerie", nama: "Gunung Inerie", provinsi: "Nusa Tenggara Timur", kabupaten: "Ngada", pulau: "Flores", ketinggian: 2245, lat: -8.7333, lon: 120.9667, status: "Berapi Aktif", jalur: "Desa Wolobobo" },

  // ---------------- KALIMANTAN ----------------
  { id: "bukit-raya", nama: "Gunung Bukit Raya", provinsi: "Kalimantan Tengah / Kalimantan Barat", kabupaten: "Katingan / Melawi", pulau: "Kalimantan", ketinggian: 2278, lat: -0.9667, lon: 112.3500, status: "Non-Vulkanik", jalur: "Tumbang Habangoi" },
  { id: "palung", nama: "Gunung Palung", provinsi: "Kalimantan Barat", kabupaten: "Ketapang", pulau: "Kalimantan", ketinggian: 1116, lat: -1.2000, lon: 110.2000, status: "Non-Vulkanik", jalur: "Cabang Panti" },
  { id: "liangpran", nama: "Gunung Liang Pran", provinsi: "Kalimantan Timur", kabupaten: "Mahakam Ulu", pulau: "Kalimantan", ketinggian: 2240, lat: 0.9000, lon: 114.8500, status: "Non-Vulkanik", jalur: "Long Apari" },

  // ---------------- SULAWESI ----------------
  { id: "rantemario", nama: "Gunung Rantemario (Latimojong)", provinsi: "Sulawesi Selatan", kabupaten: "Enrekang", pulau: "Sulawesi", ketinggian: 3478, lat: -3.3833, lon: 119.9333, status: "Non-Vulkanik", jalur: "Karangan" },
  { id: "bawakaraeng", nama: "Gunung Bawakaraeng", provinsi: "Sulawesi Selatan", kabupaten: "Gowa", pulau: "Sulawesi", ketinggian: 2830, lat: -5.3931, lon: 119.8394, status: "Berapi Tidak Aktif", jalur: "Lembanna" },
  { id: "lompobattang", nama: "Gunung Lompobattang", provinsi: "Sulawesi Selatan", kabupaten: "Gowa / Bantaeng", pulau: "Sulawesi", ketinggian: 2871, lat: -5.3400, lon: 119.9078, status: "Berapi Tidak Aktif", jalur: "Lembanna" },
  { id: "mahawu", nama: "Gunung Mahawu", provinsi: "Sulawesi Utara", kabupaten: "Tomohon", pulau: "Sulawesi", ketinggian: 1324, lat: 1.3536, lon: 124.8583, status: "Berapi Aktif", jalur: "Kakaskasen" },
  { id: "lokon", nama: "Gunung Lokon", provinsi: "Sulawesi Utara", kabupaten: "Tomohon", pulau: "Sulawesi", ketinggian: 1580, lat: 1.3583, lon: 124.7917, status: "Berapi Aktif", jalur: "Kakaskasen (dipantau ketat)" },
  { id: "soputan", nama: "Gunung Soputan", provinsi: "Sulawesi Utara", kabupaten: "Minahasa Selatan / Minahasa Tenggara", pulau: "Sulawesi", ketinggian: 1784, lat: 1.1083, lon: 124.7300, status: "Berapi Aktif", jalur: "Ditutup untuk pendakian (status Waspada)" },
  { id: "klabat", nama: "Gunung Klabat", provinsi: "Sulawesi Utara", kabupaten: "Minahasa Utara", pulau: "Sulawesi", ketinggian: 1995, lat: 1.4667, lon: 125.0333, status: "Berapi Tidak Aktif", jalur: "Airmadidi" },
  { id: "colo", nama: "Gunung Colo (Una-Una)", provinsi: "Sulawesi Tengah", kabupaten: "Tojo Una-Una", pulau: "Sulawesi", ketinggian: 507, lat: -0.1683, lon: 121.6100, status: "Berapi Aktif", jalur: "Pulau Una-Una" },

  // ---------------- MALUKU & PAPUA ----------------
  { id: "gamalama", nama: "Gunung Gamalama", provinsi: "Maluku Utara", kabupaten: "Ternate", pulau: "Ternate", ketinggian: 1715, lat: 0.8000, lon: 127.3250, status: "Berapi Aktif", jalur: "Kelurahan Marikurubu" },
  { id: "binaiya", nama: "Gunung Binaiya", provinsi: "Maluku", kabupaten: "Maluku Tengah", pulau: "Seram", ketinggian: 3027, lat: -3.1333, lon: 129.5000, status: "Non-Vulkanik", jalur: "Kanikeh" },
  { id: "jaya", nama: "Puncak Jaya (Carstensz Pyramid)", provinsi: "Papua Tengah", kabupaten: "Puncak Jaya / Mimika", pulau: "Papua", ketinggian: 4884, lat: -4.0784, lon: 137.1591, status: "Non-Vulkanik", jalur: "Basecamp Sugapa" },
  { id: "trikora", nama: "Puncak Trikora", provinsi: "Papua Pegunungan", kabupaten: "Lanny Jaya", pulau: "Papua", ketinggian: 4751, lat: -4.2578, lon: 138.6900, status: "Non-Vulkanik", jalur: "Wamena" },
  { id: "mandala", nama: "Puncak Mandala", provinsi: "Papua Pegunungan", kabupaten: "Pegunungan Bintang", pulau: "Papua", ketinggian: 4760, lat: -4.7089, lon: 140.3467, status: "Non-Vulkanik", jalur: "Oksibil" },
  { id: "yamin", nama: "Puncak Yamin", provinsi: "Papua Pegunungan", kabupaten: "Yalimo", pulau: "Papua", ketinggian: 4595, lat: -4.6167, lon: 139.9167, status: "Non-Vulkanik", jalur: "Elelim" },
];
