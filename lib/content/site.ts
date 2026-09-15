// Data desa terpusat (dari §6 AGENTS.md / situs referensi).
export const site = {
  name: "Desa Jenar",
  legalName: "Pemerintah Desa Jenar",
  tagline: "Kec. Jenar, Kab. Sragen",
  region: "Kecamatan Jenar, Kabupaten Sragen, Jawa Tengah",
  slogan: "Pelayanan Umum Gratis",
  url: "https://Jenar.desa.id",
  email: "ds.jenar.sragen@gmail.com",
  phone: "0813-9301-1650",
  phoneIntl: "+6281393011650",
  address:
    "Jl. Pungkruk – Tanon, Km. 1, Dk. Jenar RT 3, Jenar, Sragen, Jawa Tengah 57281",
  address2: {
    street: "Jl. Pungkruk – Tanon, Km. 1, Dk. Jenar RT 3",
    locality: "Jenar",
    region: "Jawa Tengah",
    postalCode: "57281",
    country: "ID",
  },
  links: {
    aduan: "http://bit.ly/PengaduanJenar",
    skm: "https://bit.ly/SKMDesaJenar",
    spak: "https://bit.ly/SPAKDesaJenar",
  },
  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
  },
} as const;

export const jamPelayanan = [
  {
    day: "Senin – Kamis",
    time: "07.30 – 16.00 WIB",
    rest: "Istirahat 12.00 – 13.00",
  },
  { day: "Jum'at", time: "07.15 – 14.30 WIB", rest: "Istirahat 11.30 – 12.30" },
  { day: "Sabtu – Minggu", time: "Libur", rest: null },
] as const;
