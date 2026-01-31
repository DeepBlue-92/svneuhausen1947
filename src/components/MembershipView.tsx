import React from 'react';
import { Download, Users, CheckCircle, FileText, Info, HelpCircle } from 'lucide-react';

const MembershipView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
      
      {/* Header Section */}
      <div className="bg-club-600 rounded-[24px] shadow-sm p-8 md:p-12 mb-8 text-white relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Bring dich ins Spiel!</h1>
            <p className="text-club-100 text-lg max-w-2xl leading-relaxed">
                Egal ob aktiv am Ball, auf dem Court oder als unterstützendes Mitglied – beim SV Neuhausen ist jeder herzlich willkommen.
                Gemeinsam bewegen wir mehr.
            </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
            <Users size={300} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4">
        
        {/* Left Column: Benefits & Process */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* Download Card (Sticky functionality on large screens) */}
            <div className="bg-club-50 rounded-[24px] shadow-sm p-8 border border-club-100 text-center sticky top-24">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-club-600">
                    <FileText size={32} />
                </div>
                <h3 className="text-lg font-bold text-club-900 mb-2">Aufnahmeantrag</h3>
                <p className="text-club-700/80 text-sm mb-6">
                    Lade den Antrag herunter, fülle ihn aus und gib ihn bei deinem Trainer oder der Abteilungsleitung ab.
                </p>
                <button 
                    onClick={() => window.open("https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/8f18a9f9aafc14eb955f87ea1cef24c5a1f9a896/Aufnahmeantrag_2024.pdf", "_blank")}
                    className="w-full bg-club-600 hover:bg-club-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                    <Download size={20} />
                    PDF Herunterladen
                </button>
            </div>

            <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="text-club-600" size={20} /> Deine Vorteile
                </h2>
                <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex gap-2 items-start">
                        <div className="h-1.5 w-1.5 rounded-full bg-club-400 mt-1.5 shrink-0"></div>
                        <span>Zugang zu allen Sportangeboten (Bitte Spartenbeiträge beachten)</span>
                    </li>
                    <li className="flex gap-2 items-start">
                        <div className="h-1.5 w-1.5 rounded-full bg-club-400 mt-1.5 shrink-0"></div>
                        <span>Versicherungsschutz bei Aktivitäten</span>
                    </li>
                    <li className="flex gap-2 items-start">
                        <div className="h-1.5 w-1.5 rounded-full bg-club-400 mt-1.5 shrink-0"></div>
                        <span>Teilnahme an Vereinsfesten</span>
                    </li>
                    <li className="flex gap-2 items-start">
                        <div className="h-1.5 w-1.5 rounded-full bg-club-400 mt-1.5 shrink-0"></div>
                        <span>Förderung der regionalen Jugendarbeit</span>
                    </li>
                </ul>
            </div>
        </div>

        {/* Right Column: Fees Detail */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Hauptverein */}
            <div className="bg-white rounded-[24px] shadow-sm overflow-hidden border border-slate-100">
                <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex justify-between items-center flex-wrap gap-2">
                    <h2 className="text-xl font-bold text-slate-900">Beiträge Hauptverein</h2>
                    <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 uppercase tracking-wide">Basis-Mitgliedschaft</span>
                </div>
                
                <div className="p-8">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left mb-6">
                            <thead className="text-slate-500 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="pb-3 pl-2 w-2/3">Kategorie</th>
                                    <th className="pb-3 pr-2 text-right">Jahresbeitrag</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-slate-700">
                                <tr><td className="py-3 pl-2 font-medium">Erwachsene</td><td className="py-3 pr-2 text-right font-bold">50,00 €</td></tr>
                                <tr><td className="py-3 pl-2">Senioren ab 60 Jahre</td><td className="py-3 pr-2 text-right">42,00 €</td></tr>
                                <tr><td className="py-3 pl-2">Ehepaare mit Kindern (bis 18 Jahre)</td><td className="py-3 pr-2 text-right">104,00 €</td></tr>
                                <tr><td className="py-3 pl-2">Jugendliche (14 - 18 Jahre)</td><td className="py-3 pr-2 text-right">25,00 €</td></tr>
                                <tr><td className="py-3 pl-2">Kinder (7 - 13 Jahre)</td><td className="py-3 pr-2 text-right">15,00 €</td></tr>
                                <tr><td className="py-3 pl-2 text-slate-500">Kinder (0 - 6 Jahre)</td><td className="py-3 pr-2 text-right text-club-600 font-medium">frei</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-xl flex gap-3 items-start">
                        <Info size={18} className="shrink-0 mt-0.5" />
                        <div>
                            <strong>Unterjähriger Eintritt:</strong><br/>
                            Bei Eintritt während des Jahres wird 1/12 des Jahresbeitrags pro Monat berechnet.
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Tennisabteilung */}
            <div className="bg-white rounded-[24px] shadow-sm overflow-hidden border border-slate-100 relative">
                <div className="bg-club-50 px-8 py-4 border-b border-club-100 flex justify-between items-center flex-wrap gap-2">
                    <h2 className="text-xl font-bold text-club-900">Beiträge Tennisabteilung</h2>
                    <span className="text-xs font-bold text-club-600 bg-white px-2 py-1 rounded border border-club-100 uppercase tracking-wide">Zusatzbeitrag</span>
                </div>
                
                <div className="p-8">
                    <p className="text-sm text-slate-500 mb-6 italic">
                        Die Mitgliedschaft in der Tennisabteilung setzt die Mitgliedschaft im Hauptverein voraus. 
                        Es fällt <strong>keine Aufnahmegebühr</strong> an.
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left mb-8">
                            <thead className="text-slate-500 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="pb-3 pl-2 w-2/3">Kategorie</th>
                                    <th className="pb-3 pr-2 text-right">Jahresbeitrag</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-slate-700">
                                <tr><td className="py-3 pl-2 font-medium">Erwachsene</td><td className="py-3 pr-2 text-right font-bold">40,00 €</td></tr>
                                <tr><td className="py-3 pl-2">Senioren ab 60 Jahre</td><td className="py-3 pr-2 text-right">30,00 €</td></tr>
                                <tr><td className="py-3 pl-2">Ehepaare mit Kindern (bis 18 Jahre)</td><td className="py-3 pr-2 text-right">70,00 €</td></tr>
                                <tr><td className="py-3 pl-2 text-slate-500">Jugendliche (14 - 18 Jahre)</td><td className="py-3 pr-2 text-right text-club-600 font-medium">frei</td></tr>
                                <tr><td className="py-3 pl-2 text-slate-500">Kinder (7 - 13 Jahre)</td><td className="py-3 pr-2 text-right text-club-600 font-medium">frei</td></tr>
                                <tr><td className="py-3 pl-2 text-slate-500">Kinder (0 - 6 Jahre)</td><td className="py-3 pr-2 text-right text-club-600 font-medium">frei</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                        <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                            <HelpCircle size={16} className="text-slate-400"/> Regelung bei unterjährigem Eintritt (Tennis)
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                            <div className="flex justify-between p-2 bg-white rounded border border-slate-100">
                                <span className="text-slate-500">bis Mai</span>
                                <span className="font-bold">100%</span>
                            </div>
                            <div className="flex justify-between p-2 bg-white rounded border border-slate-100">
                                <span className="text-slate-500">im Juni</span>
                                <span className="font-bold">80%</span>
                            </div>
                            <div className="flex justify-between p-2 bg-white rounded border border-slate-100">
                                <span className="text-slate-500">im Juli</span>
                                <span className="font-bold">60%</span>
                            </div>
                            <div className="flex justify-between p-2 bg-white rounded border border-slate-100">
                                <span className="text-slate-500">im August</span>
                                <span className="font-bold">40%</span>
                            </div>
                            <div className="flex justify-between p-2 bg-white rounded border border-slate-100">
                                <span className="text-slate-500">im September</span>
                                <span className="font-bold">20%</span>
                            </div>
                            <div className="flex justify-between p-2 bg-club-50 text-club-700 rounded border border-club-100">
                                <span className="font-medium">ab Oktober</span>
                                <span className="font-bold">frei</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default MembershipView;