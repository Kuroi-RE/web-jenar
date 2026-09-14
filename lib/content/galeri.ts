// Galeri kegiatan Desa Sidoharjo. Gambar sementara memakai aset hero;
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
    judul: "Musyawarah Desa",
    alt: "Suasana musyawarah desa di Balai Desa Sidoharjo",
    kategori: "Pemerintahan",
  },
  {
    src: "/images/hero/slide-2.jpeg",
    judul: "Perencanaan Pembangunan",
    alt: "Kegiatan perencanaan pembangunan Desa Sidoharjo",
    kategori: "Pembangunan",
  },
  {
    src: "/images/hero/slide-3.jpg",
    judul: "Rapat Koordinasi Perangkat",
    alt: "Rapat koordinasi perangkat Desa Sidoharjo",
    kategori: "Kegiatan",
  },
  {
    src: "/images/hero/slide-1.jpeg",
    judul: "Pelayanan Masyarakat",
    alt: "Petugas melayani warga di kantor Desa Sidoharjo",
    kategori: "Pelayanan",
  },
  {
    src: "/images/hero/slide-2.jpeg",
    judul: "Gotong Royong Warga",
    alt: "Warga bergotong royong membersihkan lingkungan desa",
    kategori: "Sosial",
  },
  {
    src: "/images/hero/slide-3.jpg",
    judul: "Kegiatan Posyandu",
    alt: "Kegiatan posyandu di Desa Sidoharjo",
    kategori: "Kesehatan",
  },
];
