import React from 'react';
import { Flag, Trophy, Home, Users, ArrowUpRight, ArrowDownRight, Hammer, Plus, Camera } from 'lucide-react';

interface TimelineItem {
  year: string;
  text: string;
  type: 'founding' | 'promotion' | 'construction' | 'department' | 'relegation' | 'general';
  imageUrl?: string;
  imageCaption?: string;
}

const historyData: TimelineItem[] = [
  { year: '1947', text: 'Gründung des SV Neuhausen e. V.', type: 'founding' },
  { year: '1950/1951', text: 'Aufstieg in die B-Klasse Kelheim', type: 'promotion' },
  { 
      year: '1960er', 
      text: 'Fußballmannschaften der 1960er-Jahre', 
      type: 'general',
      imageUrl: 'https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/7646da62419a20de451586f0b425e4a703b02a69/images/chronik/Chronik_1.png',
      imageCaption: 'Fußballmannschaften der 1960er-Jahre'
  },
  { year: '1973', text: 'Gründung der Abteilung Damengymnastik', type: 'department' },
  { year: '1974/1975', text: 'Vizemeister C-Klasse Landshut', type: 'general' },
  { year: '1975/1976', text: 'Vizemeister C-Klasse Landshut', type: 'general' },
  { 
      year: '1978-1982', 
      text: 'Errichtung des Sportheimes sowie des Hauptplatzes', 
      type: 'construction',
      imageUrl: 'https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/7646da62419a20de451586f0b425e4a703b02a69/images/chronik/Chronik_5.png',
      imageCaption: 'Sportheim nach der Fertigstellung 1982'
  },
  { 
      year: '1979', 
      text: 'Gründung der Abteilung Kegeln', 
      type: 'department',
      imageUrl: 'https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/7646da62419a20de451586f0b425e4a703b02a69/images/chronik/Chronik_2.png',
      imageCaption: 'Kegelmannschaft 1979'
  },
  { 
      year: '1980/1981', 
      text: 'Vizemeister C-Klasse Mainburg und Aufstieg in die B-Klasse Laaber', 
      type: 'promotion',
      imageUrl: 'https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/7646da62419a20de451586f0b425e4a703b02a69/images/chronik/Chronik_3.png',
      imageCaption: 'Aufstiegsmannschaft der Saison 1980/1981'
  },
  {
      year: '1981',
      text: 'Gymnastikabteilung 1981',
      type: 'general',
      imageUrl: 'https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/7646da62419a20de451586f0b425e4a703b02a69/images/chronik/Chronik_4.png',
      imageCaption: 'Gymnastikabteilung 1981'
  },
  { year: '1992', text: 'Gründung der Abteilung Tennis', type: 'department' },
  { year: '1993', text: 'Errichtung der aus 2 Plätzen bestehenden Tennisanlage', type: 'construction' },
  { year: '1994', text: 'Bau der ersten Tennishütte', type: 'construction' },
  { year: '1998', text: 'Gründung der Abteilung Karate', type: 'department' },
  { 
      year: '2000', 
      text: 'Errichtung des Fußball-Trainingsplatzes sowie des heutigen Tennisheimes', 
      type: 'construction',
      imageUrl: 'https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/7646da62419a20de451586f0b425e4a703b02a69/images/chronik/Chronik_6.png',
      imageCaption: 'Tennisheim nach der Fertigstellung 2000'
  },
  { 
      year: '2007/2008', 
      text: 'Meister A-Klasse Landshut und Aufstieg in die Kreisklasse Laaber', 
      type: 'promotion',
      imageUrl: 'https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/7646da62419a20de451586f0b425e4a703b02a69/images/chronik/Chronik_7.png',
      imageCaption: 'Meistermannschaft der Saison 2007/2008'
  },
  { 
      year: '2010/2011', 
      text: 'Vizemeister Kreisklasse Laaber und Aufstieg in die Kreisliga Landshut', 
      type: 'promotion',
      imageUrl: 'https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/7646da62419a20de451586f0b425e4a703b02a69/images/chronik/Chronik_8.png',
      imageCaption: 'Aufstiegsmannschaft der Saison 2010/2011' 
  },
  { year: '2010/2011', text: 'Sanierung und Ausbau des Sportheimes', type: 'construction' },
  { year: '2014-2017', text: 'Spielgemeinschaft mit der DJK-SV Furth', type: 'general' },
  { year: '2015', text: 'Bau einer überdachten Zuschauertribüne', type: 'construction' },
  { year: '2016/2017', text: 'Abstieg in die Kreisklasse Laaber', type: 'relegation' },
  { year: '2017', text: 'Niederbayerischer Vizemeister im Futsal', type: 'general' },
  { year: '2023-', text: 'Spielgemeinschaft zwischen dem SV Neuhausen und dem SC Weihmichl', type: 'general' },
  { year: '2023/2024', text: 'Meister der A-Klasse Landshut und Aufstieg in die Kreisklasse Landshut', type: 'promotion' },
];

const getIcon = (type: string) => {
    switch (type) {
        case 'founding': return <Flag className="text-white" />;
        case 'promotion': return <Trophy className="text-white" />;
        case 'construction': return <Home className="text-white" />;
        case 'department': return <Plus className="text-white" />;
        case 'relegation': return <ArrowDownRight className="text-white" />;
        default: return <Users className="text-white" />;
    }
};

const getColor = (type: string) => {
    switch (type) {
        case 'founding': return 'bg-club-900';
        case 'promotion': return 'bg-amber-400';
        case 'construction': return 'bg-slate-500';
        case 'department': return 'bg-club-600';
        case 'relegation': return 'bg-red-500';
        default: return 'bg-club-400';
    }
};

const HistoryView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Unsere Chronik</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Von der Gründung im Jahr 1947 bis heute. Eine Geschichte voller Leidenschaft, Ehrenamt und sportlicher Erfolge.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Central Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -ml-px"></div>

        <div className="space-y-12">
            {historyData.map((item, index) => {
                const isLeft = index % 2 === 0;
                return (
                    <div key={index} className={`relative flex items-center md:justify-between ${!isLeft ? 'md:flex-row-reverse' : ''}`}>
                        
                        {/* Dot / Icon on Line */}
                        <div className={`absolute left-8 md:left-1/2 -ml-6 w-12 h-12 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10 ${getColor(item.type)}`}>
                            <div className="scale-75">
                                {getIcon(item.type)}
                            </div>
                        </div>

                        {/* Content Card */}
                        <div className="ml-20 md:ml-0 md:w-[45%]">
                            <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-club-200 hover:shadow-md transition-all relative group ${item.type === 'promotion' ? 'bg-amber-50/50 border-amber-100' : ''}`}>
                                
                                {/* Connector Line (Desktop only usually needed for precise visuals, simplified here) */}
                                <div className={`hidden md:block absolute top-1/2 -mt-0.5 w-6 h-0.5 bg-slate-200 ${isLeft ? '-right-6' : '-left-6'}`}></div>
                                
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${item.type === 'promotion' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                                    {item.year}
                                </span>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">
                                    {item.text}
                                </h3>
                                
                                {item.imageUrl && (
                                    <div className="mt-3 rounded-xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50 group-hover:border-club-100 transition-colors">
                                        <img 
                                            src={item.imageUrl} 
                                            alt={item.imageCaption || item.text}
                                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                        {item.imageCaption && (
                                            <div className="p-2 text-xs text-slate-600 italic bg-white/90 border-t border-slate-100 flex gap-1.5 items-start">
                                                <Camera size={12} className="shrink-0 mt-0.5 text-club-400" />
                                                {item.imageCaption}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {item.type === 'promotion' && !item.imageUrl && (
                                    <div className="absolute top-4 right-4 text-amber-200 opacity-20 group-hover:opacity-40 transition-opacity">
                                        <Trophy size={48} />
                                    </div>
                                )}
                                {item.type === 'construction' && !item.imageUrl && (
                                     <div className="absolute top-4 right-4 text-slate-200 opacity-20 group-hover:opacity-40 transition-opacity">
                                        <Hammer size={48} />
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Spacer for the other side */}
                        <div className="hidden md:block md:w-[45%]"></div>
                    </div>
                );
            })}
        </div>

        {/* End Node */}
        <div className="relative flex justify-center mt-12">
            <div className="bg-slate-100 text-slate-500 px-4 py-2 rounded-full text-sm font-medium border border-slate-200 z-10">
                Fortsetzung folgt...
            </div>
        </div>

      </div>
    </div>
  );
};

export default HistoryView;