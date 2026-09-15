// Galeri kegiatan Kecamatan Jenar. Gambar sementara memakai aset hero;
// ganti dengan foto dokumentasi asli saat tersedia.

export type GaleriItem = {
  src: string;
  judul: string;
  alt: string;
  kategori?: string;
};

export const galeriItems: GaleriItem[] = [
  {
    src: "/images/hero/slide-1.jpeg",
    judul: "Musyawarah Tingkat Kecamatan",
    alt: "Suasana musyawarah di aula Kantor Kecamatan Jenar",
    kategori: "Pemerintahan",
  },
  {
    src: "/images/hero/slide-2.jpeg",
    judul: "Musrenbang Kecamatan",
    alt: "Kegiatan musyawarah perencanaan pembangunan Kecamatan Jenar",
    kategori: "Pembangunan",
  },
  {
    src: "/images/hero/slide-3.jpg",
    judul: "Rapat Koordinasi Aparatur",
    alt: "Rapat koordinasi aparatur Kecamatan Jenar",
    kategori: "Kegiatan",
  },
  {
    src: "/images/hero/slide-1.jpeg",
    judul: "Pelayanan Masyarakat",
    alt: "Petugas melayani warga di Kantor Kecamatan Jenar",
    kategori: "Pelayanan",
  },
  {
    src: "/images/hero/slide-2.jpeg",
    judul: "Gotong Royong Warga",
    alt: "Warga bergotong royong membersihkan lingkungan",
    kategori: "Sosial",
  },
  {
    src: "/images/hero/slide-3.jpg",
    judul: "Kegiatan Posyandu",
    alt: "Kegiatan posyandu di wilayah Kecamatan Jenar",
    kategori: "Kesehatan",
  },
];
