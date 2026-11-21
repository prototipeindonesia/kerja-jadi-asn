export type Subtest = "TWK" | "TIU" | "TKP";

export interface Question {
  id: string;
  subtest: Subtest;
  topic: string;
  text: string;
  imageUrl?: string;
  options: string[];
  scores: number[];
  explanation: string;
  explanationImageUrl?: string;
  explanationVideoUrl?: string;
}

export const DURATION_MINUTES = 15; // fallback (demo default)

/** 110 soal = 100 menit (rasio BKN). Minimal 5 menit untuk demo kecil. */
export function calcDuration(jumlahSoal: number): number {
  return Math.max(5, Math.ceil((jumlahSoal * 100) / 110));
}

export const QUESTIONS: Question[] = [
  {
    id: "q1", subtest: "TWK", topic: "Pancasila & Integritas",
    text: "Pengamalan sila ke-3 Pancasila dalam kehidupan berbangsa ditunjukkan oleh...",
    options: [
      "Memaksakan kehendak kepada orang lain",
      "Gotong royong membersihkan lingkungan bersama warga",
      "Memilih teman hanya dari suku yang sama",
      "Mengutamakan kepentingan pribadi di atas kepentingan umum",
      "Menolak berpartisipasi dalam kegiatan desa",
    ],
    scores: [0, 5, 0, 0, 0],
    explanation: "Sila ke-3 (Persatuan Indonesia) diamalkan dengan gotong royong, cinta tanah air, dan mengutamakan kepentingan bersama.",
  },
  {
    id: "q2", subtest: "TWK", topic: "UUD 1945",
    text: "Pasal 27 ayat (1) UUD 1945 menjamin hak setiap warga negara atas...",
    options: [
      "Kekayaan pribadi yang tak terbatas",
      "Kesamaan kedudukan di dalam hukum dan pemerintahan",
      "Bebas dari segala pajak",
      "Mendirikan partai politik tanpa syarat",
      "Memperoleh pekerjaan tanpa seleksi",
    ],
    scores: [0, 5, 0, 0, 0],
    explanation: "Pasal 27 ayat (1): 'Segala warga negara bersamaan kedudukannya di dalam hukum dan pemerintahan...'",
  },
  {
    id: "q3", subtest: "TWK", topic: "Bhinneka Tunggal Ika",
    text: "Semboyan Bhinneka Tunggal Ika secara harfiah bermakna...",
    options: [
      "Berbeda-beda tetapi tetap satu",
      "Satu untuk semua",
      "Bersatu kita kuat",
      "Kesatuan dalam pemerintahan",
      "Persatuan dalam kemajemukan budaya",
    ],
    scores: [5, 0, 0, 0, 0],
    explanation: "Bhinneka Tunggal Ika = berbeda-beda tetapi tetap satu jua, dari kitab Sutasoma karya Mpu Tantular.",
  },
  {
    id: "q4", subtest: "TIU", topic: "Silogisme",
    text: "Semua mahasiswa rajin belajar. Semua yang rajin belajar lulus ujian. Kesimpulan yang tepat adalah...",
    options: [
      "Semua mahasiswa lulus ujian",
      "Sebagian mahasiswa lulus ujian",
      "Semua yang lulus ujian adalah mahasiswa",
      "Tidak ada mahasiswa yang lulus",
      "Mahasiswa tidak perlu rajin",
    ],
    scores: [5, 0, 0, 0, 0],
    explanation: "Silogisme kategoris: A⊂B, B⊂C → A⊂C. Semua mahasiswa ⊂ rajin belajar ⊂ lulus ujian.",
  },
  {
    id: "q5", subtest: "TIU", topic: "Deret Angka",
    text: "Lanjutkan deret berikut: 2, 4, 8, 16, ..., 64",
    options: ["24", "28", "30", "32", "36"],
    scores: [0, 0, 0, 5, 0],
    explanation: "Setiap suku dikali 2. 16 × 2 = 32.",
  },
  {
    id: "q6", subtest: "TIU", topic: "Aritmatika",
    text: "Jika 3x + 5 = 20, maka nilai 2x adalah...",
    options: ["5", "8", "10", "12", "15"],
    scores: [0, 0, 5, 0, 0],
    explanation: "3x = 15 → x = 5 → 2x = 10.",
  },
  {
    id: "q7", subtest: "TIU", topic: "Analogi",
    text: "Dokter : Rumah Sakit = Guru : ...",
    options: ["Murid", "Buku", "Sekolah", "Papan Tulis", "Ilmu"],
    scores: [0, 0, 5, 0, 0],
    explanation: "Relasi profesi–tempat bekerja. Dokter bekerja di rumah sakit, guru di sekolah.",
  },
  {
    id: "q8", subtest: "TKP", topic: "Pelayanan Publik",
    text: "Anda sebagai ASN menerima keluhan warga yang emosional terkait layanan lambat. Sikap Anda...",
    options: [
      "Mendengarkan dengan tenang, meminta maaf, dan segera menindaklanjuti",
      "Menyuruh warga menunggu tanpa penjelasan",
      "Membalas dengan tegas agar warga tenang",
      "Mengabaikan karena bukan tugas saya",
      "Menyalahkan sistem di depan warga",
    ],
    scores: [5, 2, 3, 1, 2],
    explanation: "Pelayanan publik yang baik = empati, komunikasi, dan tindak lanjut nyata.",
  },
  {
    id: "q9", subtest: "TKP", topic: "Kerja Sama Tim",
    text: "Rekan tim Anda tidak menyelesaikan bagiannya menjelang deadline. Anda...",
    options: [
      "Mengingatkan dengan sopan dan menawarkan bantuan",
      "Mengerjakan sendiri tanpa memberi tahu atasan",
      "Melaporkan langsung ke atasan tanpa konfirmasi",
      "Mendiamkan dan membiarkan proyek gagal",
      "Menyebarkan masalah ke rekan lain",
    ],
    scores: [5, 3, 2, 1, 1],
    explanation: "Kolaborasi proaktif dan komunikasi asertif adalah kunci kerja tim efektif.",
  },
  {
    id: "q10", subtest: "TKP", topic: "Prioritas Kerja",
    text: "Anda punya 3 tugas dengan deadline berbeda. Tugas A besok, B minggu depan, C bulan depan. Anda...",
    options: [
      "Mengerjakan A dulu, lalu B, lalu C",
      "Mengerjakan yang paling mudah dulu",
      "Mengerjakan C dulu karena paling lama",
      "Menunda semua sampai mendekati deadline",
      "Meminta perpanjangan semua deadline",
    ],
    scores: [5, 3, 2, 1, 1],
    explanation: "Prioritas berdasarkan urgensi × kepentingan (Eisenhower Matrix). Deadline terdekat dulu.",
  },
];

const STORAGE_KEY = "kjb:questions";

/** Ambil soal: dari localStorage (hasil import) atau fallback ke demo bawaan. */
export function getQuestions(): Question[] {
  if (typeof window === "undefined") return QUESTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return QUESTIONS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as Question[];
  } catch {
    /* fallback */
  }
  return QUESTIONS;
}