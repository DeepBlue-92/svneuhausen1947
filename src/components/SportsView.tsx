import React from 'react';
import { ChevronRight } from 'lucide-react';
import { PicFussball, PicKinderFussball, PicKarate, PicSchwertkampf, PicTennis, PicTurnen } from './Pictograms';

const SportsView: React.FC = () => {
  const sports = [
    { name: 'Fußball', icon: <PicFussball className="w-10 h-10" />, desc: 'Von der Kreisklasse bis zur Jugendförderung.' },
    { name: 'Kinderfußball', icon: <PicKinderFussball className="w-10 h-10" />, desc: 'Spiel und Spaß für die Kleinsten.' },
    { name: 'Karate', icon: <PicKarate className="w-10 h-10" />, desc: 'Körperbeherrschung und Disziplin.' },
    { name: 'Schwertkampf', icon: <PicSchwertkampf className="w-10 h-10" />, desc: 'Historische Kampfkunst und Technik.' },
    { name: 'Tennis', icon: <PicTennis className="w-10 h-10" />, desc: '6 Sandplätze & Halle.' },
    { name: 'Turn dich fit', icon: <PicTurnen className="w-10 h-10" />, desc: 'Gymnastik und Yoga für alle.' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sports.map((s, i) => (
            <div key={i} className="bg-white rounded-[20px] shadow-sm p-4 border border-slate-100 flex items-center gap-4 hover:border-club-200 hover:shadow-md transition-all duration-300 group cursor-pointer">
                <div className="flex-shrink-0 p-3 bg-slate-50 rounded-xl shadow-inner text-club-600 group-hover:bg-club-50 group-hover:scale-105 transition-all duration-300">
                    {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-club-600 transition-colors truncate">{s.name}</h3>
                    <p className="text-slate-500 text-xs truncate">{s.desc}</p>
                </div>
                <div className="text-slate-300 group-hover:text-club-600 transition-colors">
                    <ChevronRight size={20} />
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default SportsView;