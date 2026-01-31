import React from 'react';
import { ArrowLeft, FileText, Download, ExternalLink } from 'lucide-react';

interface TennisRulesViewProps {
  onBack: () => void;
}

const TennisRulesView: React.FC<TennisRulesViewProps> = ({ onBack }) => {

  const handleDownload = () => {
    // Öffnet die Raw-Version des PDFs für direkte Ansicht/Download
    window.open("https://github.com/DeepBlue-92/svneuhausen1947/raw/83409efaba074532b4391b6a087068505b8af8e8/Spiel-%20und%20Platzordnung%20SV%20Neuhausen%20Tennis%202022.pdf", "_blank");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
            <button 
            onClick={onBack}
            className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shrink-0"
            >
            <ArrowLeft size={24} />
            </button>
            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <FileText className="text-club-600" /> Spiel- und Platzordnung
                </h1>
                <p className="text-slate-500">Abteilung Tennis • SV Neuhausen e.V.</p>
            </div>
        </div>

        <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-900 transition-all shadow-sm"
        >
            <Download size={18} />
            <span>PDF Download</span>
        </button>
      </div>

      <div className="space-y-8">
            <div className="bg-white rounded-[24px] shadow-sm p-8 border border-slate-100 text-slate-700 leading-relaxed">
                
                {/* 1. Spielberechtigung */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">1. Spielberechtigung</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Spielberechtigt sind alle Mitglieder der Tennisabteilung des SV Neuhausen.</li>
                        <li>Die Spielberechtigung ist nicht übertragbar.</li>
                    </ul>
                </section>

                {/* 2. Spielzeiten */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">2. Spielzeiten</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Für reguläre Trainingszeiten (Herren-, Damen-, Kinder- und Jugendtraining, Trainingsabende am Dienstag und Freitag) sowie für Meisterschaften und Turniere sind die Plätze geblockt.</li>
                        <li>An sonstigen freien Zeiten können individuelle Buchungen für Einzel und Doppel vorgenommen werden.</li>
                    </ul>
                </section>

                {/* 3. Platzreservierung */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">3. Platzreservierung</h2>
                    <p className="mb-4">
                        Platzreservierungen sind ausschließlich über das Online-Buchungssystem möglich.
                    </p>

                    <div className="mb-6 p-4 bg-white border border-slate-200 rounded-xl inline-block shadow-sm">
                        <img
                            src="https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/8f18a9f9aafc14eb955f87ea1cef24c5a1f9a896/qr_code_supersaas.svg"
                            alt="QR Code Buchungssystem"
                            className="w-32 h-32"
                        />
                        <p className="text-[10px] text-center text-slate-500 mt-2 font-medium">Scan mich</p>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4 max-w-lg">
                        <div className="text-sm font-bold text-slate-500 uppercase mb-1">Benutzername & Passwort</div>
                        <p className="font-mono text-slate-800">
                             Dein Name im Format: <span className="bg-white px-1 rounded border border-slate-200">vornamenachname</span> (Kleinbuchstaben)
                        </p>
                    </div>

                    <a 
                        href="https://www.supersaas.de/schedule/svneuhausen1947/Platzbelegung" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-club-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-club-700 transition-colors mb-4"
                    >
                        Zum Buchungssystem <ExternalLink size={16} />
                    </a>

                    <ul className="list-disc pl-5 space-y-2">
                        <li>Reservierbar pro Tag: 1 Std. Einzel oder 2 Std. Doppel.</li>
                        <li>Die Reservierung entfällt, wenn der Platz 10 Min. nach der gebuchten Zeit nicht belegt ist.</li>
                    </ul>
                </section>

                {/* 4. Gastspieler */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">4. Gastspieler</h2>
                    <p className="mb-4">
                        Gastspieler dürfen nur mit einem Vereinsmitglied spielen. Das Vereinsmitglied ist für die Platzreservierung und die Begleichung der Gebühren zuständig (Eintrag in Gastspieler-Liste im Schaukasten).
                    </p>
                    
                    <div className="overflow-hidden rounded-xl border border-slate-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-900 font-bold">
                                <tr>
                                    <th className="p-3">Pro Gastspieler & Std.</th>
                                    <th className="p-3 border-l border-slate-200">Einzel</th>
                                    <th className="p-3 border-l border-slate-200">Doppel</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="p-3 font-medium">Erwachsene</td>
                                    <td className="p-3 border-l border-slate-100">3,50 €</td>
                                    <td className="p-3 border-l border-slate-100">2,50 €</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium">Jugendliche</td>
                                    <td className="p-3 border-l border-slate-100">1,50 €</td>
                                    <td className="p-3 border-l border-slate-100">1,00 €</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 5-8 Remaining Sections */}
                <section className="space-y-6">
                    <div>
                        <h3 className="font-bold text-slate-900">5. Platzbehandlung und -Pflege</h3>
                        <p className="text-sm mt-1">
                            Betreten nur mit Tennisschuhen. Bei Trockenheit wässern. Nach Spielende abziehen und Linien kehren. Mängel sofort melden.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">6. Platzsperre</h3>
                        <p className="text-sm mt-1">
                            Der Platzwart / Abteilungsleitung kann Plätze sperren (Witterung, Instandhaltung, Turniere).
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">7. Weisung</h3>
                        <p className="text-sm mt-1">
                            Jedes Mitglied kann bei Verstößen andere zurechtweisen.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">8. Haftung</h3>
                        <p className="text-sm mt-1">
                            Eltern haften für ihre Kinder. Haftung des Vereins ist auf das Maß der Versicherung begrenzt.
                        </p>
                    </div>
                </section>

                <div className="mt-8 pt-8 border-t border-slate-100 text-sm text-slate-500 font-medium">
                    Die Vorstandschaft • Stand: 13.04.2022
                </div>
            </div>
      </div>
    </div>
  );
};

export default TennisRulesView;