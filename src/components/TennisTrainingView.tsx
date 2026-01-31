import React from 'react';
import { ArrowLeft, Calendar, Clock, Euro, Mail, Info, User, Star, ChevronRight } from 'lucide-react';
import { PageType } from '../types';

interface TennisTrainingViewProps {
  onBack: () => void;
  onNavigate?: (page: PageType) => void;
}

const TennisTrainingView: React.FC<TennisTrainingViewProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
           <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
             Tennistraining 2026
           </h1>
           <p className="text-slate-500">Für Einsteiger & Fortgeschrittene</p>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Hero Section */}
        <div className="bg-club-600 p-8 text-white relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Habt ihr Lust auf Tennis?</h2>
                <p className="text-club-100 text-lg leading-relaxed">
                    Die Tennisabteilung des SV Neuhausen bietet auch heuer wieder ihr beliebtes Tennistraining für Kinder, Jugendliche, Damen und Herren (Einsteiger) an. Werde Teil der Gemeinschaft und bring dich ins Spiel!
                </p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                {/* Custom Tennis Ball Icon */}
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="200" 
                    height="200" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12a10 10 0 0 0 10 10" />
                    <path d="M12 2a10 10 0 0 0 10 10" />
                </svg>
            </div>
        </div>

        <div className="p-8 space-y-10">
            
            {/* General Info */}
            <section>
                <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-900">
                    <Calendar className="shrink-0 mt-1" size={24} />
                    <div>
                        <h3 className="font-bold text-lg mb-1">Saisonstart 2026</h3>
                        <p>
                            Das wöchentliche Training für Kindergarten-Kinder, Kinder und Jugendliche beginnt voraussichtlich im <strong>Mai 2026</strong> (sofern das Wetter mitspielt). 
                            Genauere Termine werden rechtzeitig bekannt gegeben.
                        </p>
                    </div>
                </div>
            </section>

            {/* Schedule Section */}
            <section>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Clock className="text-club-600" /> Trainingszeiten
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kids */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Star size={18} className="text-orange-400" /> Kinder & Jugend (Mittwochs)
                        </h4>
                        <ul className="space-y-3 text-slate-600">
                            <li className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <span>Tenniskindergarten</span>
                                <span className="font-bold bg-white px-2 py-1 rounded border border-slate-200 text-xs">16:45 – 17:45</span>
                            </li>
                            <li className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <span>Kindertraining</span>
                                <span className="font-bold bg-white px-2 py-1 rounded border border-slate-200 text-xs">17:00 – 18:00</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span>Jugendtraining</span>
                                <span className="font-bold bg-white px-2 py-1 rounded border border-slate-200 text-xs">18:00 – 19:00</span>
                            </li>
                        </ul>
                    </div>

                    {/* Adults */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <User size={18} className="text-club-600" /> Erwachsene
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <p className="font-bold text-sm text-slate-700 mb-1">Herren (Mittwochs)</p>
                                <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-200 text-sm text-slate-600">
                                    <span>Training</span>
                                    <span className="font-bold">18:00 – 20:00</span>
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-sm text-slate-700 mb-1">Damen (Montags)</p>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-200 text-sm text-slate-600">
                                        <span>Gruppe 1</span>
                                        <span className="font-bold">17:00 – 18:30</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-200 text-sm text-slate-600">
                                        <span>Gruppe 2</span>
                                        <span className="font-bold">18:30 – 20:00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Costs */}
            <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Euro className="text-club-600" /> Kosten & Schnuppern
                </h3>
                <div className="bg-green-50 rounded-2xl p-6 border border-green-100 text-green-900">
                    <p className="mb-4 font-medium">
                        Die ersten beiden Trainings sind kostenlos (Schnuppern).
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm mb-4">
                        <li>Danach Saison-Trainingspauschale: <strong>30,- €</strong></li>
                        <li>Eine Mitgliedschaft im Tennisverein ist nach der Schnupperphase notwendig.</li>
                    </ul>
                    {onNavigate && (
                        <button 
                            onClick={() => onNavigate('membership')}
                            className="text-sm font-semibold text-green-700 hover:text-green-800 underline decoration-green-700/30 underline-offset-4 hover:decoration-green-800 transition-all flex items-center gap-1"
                        >
                            Infos zur Mitgliedschaft & Anträge <ChevronRight size={14} />
                        </button>
                    )}
                </div>
            </section>

            {/* Registration */}
            <section className="border-t border-slate-100 pt-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Anmeldung</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <p className="text-slate-600">Bitte sende deine Anmeldung per E-Mail an einen der Ansprechpartner:</p>
                        
                        <a href="mailto:m_biermacher@web.de" className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-club-50 border border-slate-200 hover:border-club-200 transition-all group">
                            <div className="bg-white p-2 rounded-full shadow-sm text-slate-400 group-hover:text-club-600">
                                <Mail size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">Markus Biermacher</div>
                                <div className="text-sm text-slate-500 group-hover:text-club-600">m_biermacher@web.de</div>
                            </div>
                        </a>

                        <a href="mailto:johann.wendl@t-online.de" className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-club-50 border border-slate-200 hover:border-club-200 transition-all group">
                             <div className="bg-white p-2 rounded-full shadow-sm text-slate-400 group-hover:text-club-600">
                                <Mail size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">Johann Wendl</div>
                                <div className="text-sm text-slate-500 group-hover:text-club-600">johann.wendl@t-online.de</div>
                            </div>
                        </a>
                    </div>

                    <div className="bg-slate-800 text-slate-300 p-6 rounded-2xl text-sm">
                        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                            <Info size={16} /> Benötigte Angaben
                        </h4>
                        <ul className="space-y-2 list-disc pl-5">
                            <li>Name des Teilnehmers</li>
                            <li>Bei Kindern: Name des Erziehungsberechtigten</li>
                            <li>Gewünschte Gruppe</li>
                            <li>Telefonnummer</li>
                            <li>E-Mail-Adresse</li>
                        </ul>
                    </div>
                </div>
            </section>
            
            <div className="text-center pt-4 text-slate-400 text-sm">
                Vorstandschaft Tennisabteilung SV Neuhausen
            </div>

        </div>
      </div>
    </div>
  );
};

export default TennisTrainingView;