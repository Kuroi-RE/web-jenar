-- Inisialisasi database Website Desa (impor via phpMyAdmin).
-- Dihasilkan otomatis oleh scripts/db-export-sql.mjs.
-- Pilih database tujuan lebih dulu, lalu Import file ini.

SET NAMES utf8mb4;

-- =========== SKEMA ===========
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY,
  data JSON NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS berita (
  slug VARCHAR(80) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date VARCHAR(20) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'Umum',
  excerpt TEXT NOT NULL,
  image VARCHAR(255) NULL,
  image_alt VARCHAR(255) NULL,
  author VARCHAR(150) NOT NULL DEFAULT 'Pemerintah Desa Sidoharjo',
  body MEDIUMTEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_credentials (
  id INT PRIMARY KEY,
  username VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========== SEED BERITA ===========
INSERT IGNORE INTO berita (slug, title, date, category, excerpt, image, image_alt, author, body) VALUES ('musdes-panitia-pengisian-perangkat-desa', 'Musdes Sidoharjo Bentuk Panitia Pengisian Perangkat Desa', '2026-06-13', 'Pemerintahan', 'Musyawarah desa menyepakati pembentukan panitia pengisian perangkat desa untuk mengisi formasi yang kosong secara transparan dan akuntabel.', '/images/hero/slide-1.jpeg', 'Suasana musyawarah desa di Balai Desa Sidoharjo', 'Pemerintah Desa Sidoharjo', 'Pemerintah Desa Sidoharjo menggelar Musyawarah Desa (Musdes) untuk membentuk panitia pengisian perangkat desa. Kegiatan ini dihadiri oleh Kepala Desa, Badan Permusyawaratan Desa (BPD), tokoh masyarakat, serta perwakilan warga.\n\n## Tujuan Kegiatan\n\nMusdes ini bertujuan mengisi formasi perangkat desa yang masih kosong agar pelayanan kepada masyarakat berjalan optimal. Pembentukan panitia dilakukan secara terbuka untuk menjamin proses yang **transparan dan akuntabel**.\n\n## Hasil Musyawarah\n\nBeberapa keputusan penting yang disepakati dalam musyawarah:\n\n- Pembentukan panitia pengisian perangkat desa beserta susunan keanggotaannya.\n- Penetapan jadwal dan tahapan seleksi calon perangkat desa.\n- Kesepakatan mengenai kriteria dan persyaratan calon.\n\nKepala Desa Sidoharjo menekankan bahwa seluruh tahapan akan dilaksanakan sesuai peraturan yang berlaku dan mengedepankan prinsip keterbukaan.\n\n> \"Kami berkomitmen agar proses ini berjalan jujur, adil, dan dapat dipertanggungjawabkan kepada masyarakat.\"\n\nMasyarakat diharapkan turut mengawasi jalannya proses seleksi demi terwujudnya pemerintahan desa yang bersih dan melayani.');
INSERT IGNORE INTO berita (slug, title, date, category, excerpt, image, image_alt, author, body) VALUES ('musdes-perencanaan-pembangunan-2026', 'Musdes Perencanaan Pembangunan Desa Tahun Anggaran 2026', '2026-06-13', 'Pembangunan', 'Pemerintah desa bersama BPD dan warga merumuskan prioritas program pembangunan serta alokasi anggaran untuk tahun 2026.', '/images/hero/slide-2.jpeg', 'Warga menghadiri musyawarah perencanaan pembangunan desa', 'Pemerintah Desa Sidoharjo', 'Dalam rangka menyusun arah pembangunan desa, Pemerintah Desa Sidoharjo menyelenggarakan Musyawarah Desa Perencanaan Pembangunan untuk Tahun Anggaran 2026. Musyawarah ini menjadi ruang partisipasi warga dalam menentukan prioritas pembangunan.\n\n## Prioritas Pembangunan\n\nBeberapa usulan prioritas yang dibahas meliputi:\n\n1. Peningkatan infrastruktur jalan dan drainase lingkungan.\n2. Penguatan sarana pelayanan publik dan kesehatan.\n3. Pemberdayaan ekonomi masyarakat melalui UMKM dan pertanian.\n\n## Partisipasi Masyarakat\n\nMusyawarah dihadiri oleh Badan Permusyawaratan Desa (BPD), ketua RT/RW, kelompok perempuan, serta perwakilan pemuda. Seluruh usulan dicatat untuk dijadikan bahan penyusunan **Rencana Kerja Pemerintah Desa (RKPDes)** dan **APBDes** tahun berjalan.\n\nDengan perencanaan yang partisipatif, diharapkan program pembangunan yang dijalankan benar-benar menjawab kebutuhan masyarakat Desa Sidoharjo.');
INSERT IGNORE INTO berita (slug, title, date, category, excerpt, image, image_alt, author, body) VALUES ('posyandu-balita-sehat-sidoharjo', 'Kegiatan Posyandu Dukung Balita Sehat di Desa Sidoharjo', '2026-05-20', 'Kesehatan', 'Posyandu rutin Desa Sidoharjo memberikan pelayanan penimbangan, imunisasi, dan penyuluhan gizi untuk mendukung tumbuh kembang balita.', '/images/hero/slide-1.jpeg', 'Kegiatan posyandu balita di Desa Sidoharjo', 'Pemerintah Desa Sidoharjo', 'Posyandu Desa Sidoharjo kembali menyelenggarakan kegiatan rutin bulanan sebagai bentuk perhatian terhadap kesehatan ibu dan anak. Kegiatan ini melibatkan kader posyandu, bidan desa, dan dukungan penuh dari Pemerintah Desa.\n\n## Layanan yang Diberikan\n\nDalam kegiatan posyandu, warga memperoleh sejumlah layanan kesehatan dasar:\n\n- Penimbangan berat badan dan pengukuran tinggi badan balita.\n- Pemberian imunisasi dan vitamin.\n- Penyuluhan gizi serta pemberian makanan tambahan.\n\n## Pencegahan Stunting\n\nSalah satu fokus utama kegiatan ini adalah pemantauan tumbuh kembang balita untuk mencegah **stunting**. Kader posyandu mencatat perkembangan setiap anak dan memberikan edukasi kepada orang tua mengenai pola asuh dan gizi seimbang.\n\nPemerintah Desa Sidoharjo mengajak seluruh orang tua untuk aktif membawa balitanya ke posyandu setiap bulan demi memastikan tumbuh kembang anak berjalan optimal.');
INSERT IGNORE INTO berita (slug, title, date, category, excerpt, image, image_alt, author, body) VALUES ('rakor-agenda-strategis-awal-tahun', 'Rakor Desa Sidoharjo Bahas Agenda Strategis Awal Tahun', '2026-01-13', 'Kegiatan', 'Rapat koordinasi perangkat desa membahas agenda strategis, pelayanan publik, dan evaluasi program di awal tahun anggaran.', '/images/hero/slide-3.jpg', 'Rapat koordinasi perangkat Desa Sidoharjo', 'Pemerintah Desa Sidoharjo', 'Mengawali tahun anggaran, Pemerintah Desa Sidoharjo menggelar Rapat Koordinasi (Rakor) bersama seluruh perangkat desa. Rakor ini menjadi forum evaluasi sekaligus penyusunan agenda strategis untuk satu tahun ke depan.\n\n## Poin Pembahasan\n\nAgenda utama yang dibahas dalam rapat koordinasi antara lain:\n\n- Evaluasi capaian program tahun sebelumnya.\n- Penyusunan rencana kerja dan target pelayanan publik.\n- Peningkatan kualitas pelayanan administrasi kepada warga.\n\n## Komitmen Pelayanan\n\nKepala Desa mengajak seluruh perangkat untuk meningkatkan disiplin dan kualitas pelayanan sesuai slogan **\"Pelayanan Umum Gratis\"**. Setiap perangkat diminta memahami tugas pokok dan fungsinya masing-masing.\n\nRakor ditutup dengan penetapan jadwal kegiatan desa serta komitmen bersama untuk mewujudkan pelayanan yang prima dan transparan.');
