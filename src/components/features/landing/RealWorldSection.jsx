import React from 'react';
import { Bus, Clock, Fuel } from 'lucide-react';
import Card from '../../common/Card.jsx';
import Badge from '../../common/Badge.jsx';

export default function RealWorldSection() {
  const points = [
    {
      icon: Bus,
      title: 'Konektivitas Antar Fakultas',
      desc: 'Menghubungkan Fakultas Kedokteran, Hukum, Fasilkom, hingga Gedung KPA tanpa ada satu pun gedung yang terlewat dalam sekali putaran tur keliling kampus.'
    },
    {
      icon: Fuel,
      title: 'Efisiensi Jarak & Bahan Bakar',
      desc: 'Heuristik Nearest Neighbor selalu memilih titik terdekat sehingga jarak tempuh antar fakultas terpangkas secara efisien dan konsisten.'
    },
    {
      icon: Clock,
      title: 'Ketepatan Waktu Perjalanan',
      desc: 'Waktu tempuh keliling menjadi konsisten dan terprediksi, mempercepat mobilitas antarfakultas dan distribusi logistik internal kampus.'
    }
  ];

  return (
    <section className="space-y-8 pt-4">
      <div className="text-center space-y-2">
        <Badge variant="blue" dot className="mx-auto">
          Relevansi Lapangan
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Mengapa <span className="text-amber-400 font-serif italic">Optimasi Rute Kampus</span> Krusial?
        </h2>
        <p className="text-xs sm:text-sm text-blue-100/80 max-w-xl mx-auto leading-relaxed">
          Dalam dunia nyata, pencarian rute tertutup terpendek (Traveling Salesperson Problem) menjadi fondasi efisiensi operasional keliling kampus, logistik kurir, hingga transportasi publik.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {points.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} hoverEffect className="space-y-3.5 flex flex-col justify-start">
              <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 text-amber-300 flex items-center justify-center shadow-inner">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                {item.title}
              </h3>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                {item.desc}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
