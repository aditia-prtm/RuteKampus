import React from 'react';
import { Bus, Clock, Fuel, Sparkles } from 'lucide-react';
import Card from '../../common/Card.jsx';
import Badge from '../../common/Badge.jsx';

export default function RealWorldSection() {
  const points = [
    {
      icon: Bus,
      title: 'Konektivitas Antar Fakultas',
      desc: 'Menghubungkan Fakultas Kedokteran, Hukum, Fasilkom, hingga Gedung KPA tanpa ada satu pun gedung yang terlewat dalam sekali putaran shuttle.'
    },
    {
      icon: Fuel,
      title: 'Efisiensi Jarak & Bahan Bakar',
      desc: 'Optimasi 2-Opt memangkas persilangan jalan sehingga jarak tempuh kendaraan diminimalkan hingga jarak paling ekonomis.'
    },
    {
      icon: Clock,
      title: 'Ketepatan Waktu Perjalanan',
      desc: 'Jadwal putaran bus menjadi konsisten dan terprediksi, membantu mobilitas mahasiswa dan dosen yang berpindah ruang kuliah tepat waktu.'
    }
  ];

  return (
    <section className="space-y-8 pt-6">
      <div className="text-center space-y-2">
        <Badge variant="blue" dot className="mx-auto">
          Relevansi Lapangan
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Mengapa <span className="text-amber-400 font-serif italic">Optimasi Rute Kampus</span> Krusial?
        </h2>
        <p className="text-xs sm:text-sm text-blue-200/70 max-w-xl mx-auto leading-relaxed">
          Dalam dunia nyata, pencarian rute tertutup terpendek (Traveling Salesperson Problem) menjadi fondasi efisiensi operasional armada transportasi publik.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {points.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} hoverEffect className="space-y-3 flex flex-col justify-start">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/20 text-amber-400 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                {item.title}
              </h3>
              <p className="text-xs text-blue-200/70 leading-relaxed">
                {item.desc}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
