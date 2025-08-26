import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Plus, Edit, Bug, Trash2, Clock } from "lucide-react";

interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    added?: string[];
    changed?: string[];
    fixed?: string[];
    removed?: string[];
  };
}

const changelogData: ChangelogEntry[] = [
  {
    version: "1.0.3",
    date: new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    changes: {
      fixed: [
        "Memperbaiki masalah keterbacaan teks dengan meningkatkan kontras warna",
        "Menguatkan warna teks muted dan placeholder untuk visibilitas yang lebih baik",
        "Menyesuaikan opacity dan text shadow untuk aksesibilitas yang lebih baik"
      ],
      changed: [
        "Mengubah teks Arab dari 'موثوق' menjadi 'صَحِيْح' di komponen HadithBook dan HadithHero",
        "Mengubah warna teks '9 koleksi hadits sahih tersedia' menjadi hijau gelap untuk mencocokkan tombol 'Jelajahi Koleksi'",
        "Memperbarui judul 'Penjelajah Hadits' untuk menggunakan warna putih yang konsisten"
      ]
    }
  },
  {
    version: "1.3.4",
    date: new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    changes: {
      changed: [
        "Mengganti konten README dengan deskripsi yang sesuai untuk Jelajah Hadits",
        "Menambahkan dokumentasi fitur utama aplikasi",
        "Menyertakan panduan instalasi dan development",
        "Menambahkan informasi teknologi dan deployment",
        "Credit untuk developer dan API provider"
      ]
    }
  },
  {
    version: "1.3.3",
    date: new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    changes: {
      added: [
        "Favicon baru dengan desain menarik yang mencerminkan tema Islam",
        "Ikon aplikasi dengan kombinasi huruf Arab 'ج' (Jim untuk Jelajah) dan elemen buku",
        "Desain favicon dalam format SVG dengan gradien warna hijau dan emas"
      ]
    }
  },
  {
    version: "1.3.2",
    date: new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    changes: {
      fixed: [
        "Memperbaiki error 400 pada retry mechanism hadith loading",
        "Meningkatkan stabilitas pencarian hadith otomatis",
        "Memperbaiki endpoint API untuk informasi koleksi hadith",
        "Menambahkan validasi data yang lebih robust pada fetchHadithWithRetry"
      ]
    }
  },
  {
    version: "1.3.1",
    date: new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    changes: {
      added: [
        "File _redirects untuk mendukung client-side routing di Netlify",
        "Link LinkedIn untuk Sutan Gading Fadhillah Nasution di footer"
      ],
      fixed: [
        "Memperbaiki error 404 saat mengakses halaman changelog di deployment Netlify",
        "Mengatasi masalah routing untuk single-page application di hosting statis"
      ]
    }
  },
  {
    version: "1.3.0",
    date: new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    changes: {
      added: [
        "Link LinkedIn untuk developer di footer aplikasi",
        "Spesifikasi target komunitas menjadi 'Komunitas Muslim Indonesia'"
      ],
      changed: [
        "Nama aplikasi dari 'Radiant Hadith' menjadi 'Jelajah Hadits' di seluruh aplikasi",
        "Semua konten changelog diterjemahkan ke bahasa Indonesia",
        "Teks footer dari 'Data Hadits dari' menjadi 'Data koleksi hadits diambil dari'",
        "Teks footer dari 'Komunitas Muslim' menjadi 'Komunitas Muslim Indonesia'"
      ]
    }
  },
  {
    version: "1.2.0",
    date: "15 Januari 2024",
    changes: {
      added: [
        "Dukungan pencarian bahasa Indonesia untuk konten hadits",
        "Algoritma pencarian yang ditingkatkan dengan normalisasi teks yang lebih baik",
        "Logging pencarian detail untuk keperluan debugging"
      ],
      changed: [
        "Parsing respons API yang diperbaiki untuk penanganan data yang lebih baik",
        "Fungsi pencarian diperbarui untuk mendukung teks Arab dan Indonesia",
        "Penanganan error yang ditingkatkan dalam pengambilan hadits"
      ],
      fixed: [
        "Memperbaiki fungsi pencarian untuk kata kunci Indonesia seperti 'niat'",
        "Mengatasi masalah endpoint API dengan URL dasar yang benar",
        "Memperbaiki parsing data hadits dari struktur respons API"
      ]
    }
  },
  {
    version: "1.1.0",
    date: "10 Januari 2024",
    changes: {
      added: [
        "Fungsi pencarian hadits lanjutan di berbagai kitab",
        "Pencarian real-time dengan input yang di-debounce",
        "Penyorotan hasil pencarian dan skor relevansi",
        "Pemilihan kitab untuk pencarian yang ditargetkan"
      ],
      changed: [
        "Responsivitas UI dan status loading yang diperbaiki",
        "Tampilan hadits yang ditingkatkan dengan tipografi yang lebih baik",
        "Panggilan API yang dioptimalkan dengan batch fetching"
      ],
      fixed: [
        "Memperbaiki masalah paginasi dalam penjelajahan hadits",
        "Mengatasi memory leak dalam fungsi pencarian",
        "Memperbaiki masalah desain responsif pada perangkat mobile"
      ]
    }
  },
  {
    version: "1.0.0",
    date: "1 Januari 2024",
    changes: {
      added: [
        "Rilis awal aplikasi Jelajah Hadits",
        "Jelajahi koleksi hadits dari kitab-kitab utama (Bukhari, Muslim, dll.)",
        "Antarmuka pengguna yang bersih dan modern dengan Tailwind CSS",
        "Desain responsif untuk desktop dan perangkat mobile",
        "Integrasi dengan API Hadits oleh Sutan Gading Fadhillah Nasution",
        "Fungsi dasar untuk melihat dan navigasi hadits",
        "Footer dengan atribusi dan kredit yang tepat"
      ]
    }
  }
];

const getChangeIcon = (type: string) => {
  switch (type) {
    case 'added':
      return <Plus className="h-4 w-4" />;
    case 'changed':
      return <Edit className="h-4 w-4" />;
    case 'fixed':
      return <Bug className="h-4 w-4" />;
    case 'removed':
      return <Trash2 className="h-4 w-4" />;
    default:
      return null;
  }
};

const getChangeBadgeVariant = (type: string) => {
  switch (type) {
    case 'added':
      return 'default';
    case 'changed':
      return 'secondary';
    case 'fixed':
      return 'destructive';
    case 'removed':
      return 'outline';
    default:
      return 'default';
  }
};

const Changelog = () => {
  // Get build time - this will be the time when the component is first loaded
  const buildTime = new Date().toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Riwayat Perubahan</h1>
          <p className="text-lg text-gray-600">
            Lacak semua perubahan dan pembaruan pada Jelajah Hadits
          </p>
          
          {/* Build Time Display */}
          <div className="mt-4 p-3 bg-white/50 rounded-lg border border-gray-200 inline-block">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span className="font-medium">Dibuat pada:</span>
              <span className="ml-2 text-gray-800 font-mono">{buildTime}</span>
            </div>
          </div>
        </div>

        {/* Changelog Entries */}
        <div className="space-y-6">
          {changelogData.map((entry, index) => (
            <Card key={entry.version} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Version {entry.version}
                  </CardTitle>
                  <div className="flex flex-col items-end text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">Dirilis: {entry.date}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-xs text-gray-400">Dibuat: {buildTime}</span>
                    </div>
                  </div>
                </div>
                {index === 0 && (
                  <Badge variant="default" className="w-fit">
                    Terbaru
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(entry.changes).map(([changeType, changes]) => (
                    changes && changes.length > 0 && (
                      <div key={changeType}>
                        <div className="flex items-center mb-2">
                          <Badge 
                            variant={getChangeBadgeVariant(changeType) as "default" | "secondary" | "destructive" | "outline"}
                            className="flex items-center gap-1 capitalize"
                          >
                            {getChangeIcon(changeType)}
                            {changeType}
                          </Badge>
                        </div>
                        <ul className="ml-4 space-y-1">
                          {changes.map((change, changeIndex) => (
                            <li key={changeIndex} className="text-gray-700 flex items-start">
                              <span className="text-gray-400 mr-2">•</span>
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-6">
          <Separator className="mb-4" />
          <p className="text-gray-500 text-sm">
            Untuk dukungan teknis atau permintaan fitur, silakan hubungi tim pengembang.
          </p>
          <div className="mt-4">
            <a 
              href="/" 
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              ← Kembali ke Jelajah Hadits
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Changelog;