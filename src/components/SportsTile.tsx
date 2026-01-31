import React from 'react';
import { ChevronRight } from 'lucide-react';
import { PicFussball, PicTennis, PicTurnen, PicTischtennis } from './Pictograms';

const SportsTile: React.FC = () => {
  const sports = [
    { name: 'Fußball', icon: <PicFussball className="w-10 h-10" />, desc: 'Von Bambini bis Senioren' },
    { name: 'Tennis', icon: <PicTennis className="w-10 h-10" />, desc: '6 Sandplätze & Halle' },
    { name: 'Turnen', icon: <PicTurnen className="w-10 h-10" />, desc: 'Gesundheitssport' },
    { name: 'Tischtennis', icon: <PicTischtennis className="w-10 h-10" />, desc: 'Hobby & Liga' },
  ];

  return (
    <div className="col-span-1 md:col-span-2 bg-white rounded-[24px] shadow-sm p-6 md:p-8 border border-slate-100 flex flex-col justify-center min-h-[280px]">
       <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <div className="p-2 bg-club-50 rounded-lg text-club-600">
             {/* Tiny version for header */}
             <PicFussball className="w-5 h-5" />
          </div>
          Unsere Sparten
        </h2>
        <a href="#" className="flex items-center gap-1 text-xs font-semibold text-club-600 hover:text-club-700 hover:underline">
          Alle Abteilungen <ChevronRight size={14} />
        </a>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
        {sports.map((s, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-club-50 hover:text-club-700 transition-all duration-300 cursor-pointer group border border-slate-100 hover:border-club-200 shadow-sm hover:shadow-md">
                <div className="mb-3 p-3 bg-white rounded-full shadow-sm text-slate-400 group-hover:text-club-600 group-hover:scale-110 transition-all duration-300 border border-slate-50 group-hover:border-club-100">
                    {s.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-club-700">{s.name}</h3>
                <p className="text-xs text-slate-500 text-center group-hover:text-club-600/70">{s.desc}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default SportsTile;