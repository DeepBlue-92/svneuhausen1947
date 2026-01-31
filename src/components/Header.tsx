import React, { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { PageType } from '../types';
import { PicFussball, PicKinderFussball, PicKarate, PicSchwertkampf, PicTennis, PicTurnen, PicKinderTurnen } from './Pictograms';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onSportSelect: (sportId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onSportSelect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSportsHovered, setIsSportsHovered] = useState(false);

  const sports = [
    { id: 'fussball', name: 'Fußball', icon: <PicFussball className="w-8 h-8" /> },
    { id: 'kinderfussball', name: 'Kinderfußball', icon: <PicKinderFussball className="w-8 h-8" /> },
    { id: 'karate', name: 'Karate', icon: <PicKarate className="w-8 h-8" /> },
    { id: 'kinderturnen', name: 'Kinderturnen', icon: <PicKinderTurnen className="w-8 h-8" /> },
    { id: 'schwertkampf', name: 'Schwertkampf', icon: <PicSchwertkampf className="w-8 h-8" /> },
    { id: 'tennis', name: 'Tennis', icon: <PicTennis className="w-8 h-8" /> },
    { id: 'turndichfit', name: 'Turn dich fit', icon: <PicTurnen className="w-8 h-8" /> },
  ];

  const handleNavClick = (page: PageType) => {
    onNavigate(page);
    setIsMenuOpen(false);
    setIsSportsHovered(false);
  };

  const handleSportClick = (sportId: string) => {
    onSportSelect(sportId);
    setIsMenuOpen(false);
    setIsSportsHovered(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 border-b border-white/20 shadow-sm transition-all" onMouseLeave={() => setIsSportsHovered(false)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div 
            className="flex-shrink-0 flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick('aktuelles')}
          >
            {/* Wappen Logo - Removed Zoom Effect */}
            <img 
              src="https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/4d546746461cb1b039a35dbfbc61da86aca6f485/Wappen.png"
              alt="SV Neuhausen Wappen"
              className="h-12 w-auto object-contain drop-shadow-sm"
            />
            
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-3xl leading-none text-club-600 tracking-tight">
                SV Neuhausen e.V.
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-6">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('aktuelles')}
                className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    currentPage === 'aktuelles' ? 'bg-club-50 text-club-600' : 'text-slate-600 hover:text-club-600 hover:bg-slate-50'
                }`}
              >
                Start
              </button>

              <button
                onClick={() => handleNavClick('news-archive')}
                className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    currentPage === 'news-archive' ? 'bg-club-50 text-club-600' : 'text-slate-600 hover:text-club-600 hover:bg-slate-50'
                }`}
              >
                Neuigkeiten
              </button>

              <button
                onClick={() => handleNavClick('calendar')}
                className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    currentPage === 'calendar' ? 'bg-club-50 text-club-600' : 'text-slate-600 hover:text-club-600 hover:bg-slate-50'
                }`}
              >
                Termine
              </button>

              <div 
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setIsSportsHovered(true)}
              >
                  <button
                  className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 cursor-default ${
                      isSportsHovered || currentPage === 'sport-detail'
                      ? 'bg-club-50 text-club-600'
                      : 'text-slate-600 hover:text-club-600 hover:bg-slate-50'
                  }`}
                  >
                  Sportarten
                  </button>
              </div>

               <button
                onClick={() => handleNavClick('history')}
                className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    currentPage === 'history' ? 'bg-club-50 text-club-600' : 'text-slate-600 hover:text-club-600 hover:bg-slate-50'
                }`}
              >
                Chronik
              </button>

              <button
                onClick={() => handleNavClick('kontakt')}
                className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    currentPage === 'kontakt' ? 'bg-club-50 text-club-600' : 'text-slate-600 hover:text-club-600 hover:bg-slate-50'
                }`}
              >
                Kontakt
              </button>
            </nav>
            {/* CTA Button in Header */}
            <button 
              onClick={() => handleNavClick('membership')}
              className="bg-club-red hover:bg-club-red-hover text-white px-6 py-2.5 rounded-xl font-semibold text-base shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Mitglied werden
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-club-600 hover:bg-club-50 focus:outline-none transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Mega Menu for Sports */}
      <div 
        className={`hidden xl:block absolute top-20 left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-lg overflow-hidden transition-all duration-300 origin-top ${isSportsHovered ? 'max-h-[400px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}
        onMouseEnter={() => setIsSportsHovered(true)}
        onMouseLeave={() => setIsSportsHovered(false)}
      >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-4 gap-6">
                {sports.map((s, i) => (
                    <div 
                        key={i} 
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-club-50 cursor-pointer group transition-colors"
                        onClick={() => handleSportClick(s.id)}
                    >
                        <div className="flex-shrink-0 p-2 bg-slate-50 text-club-600 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                            {s.icon}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 group-hover:text-club-700">{s.name}</h4>
                        </div>
                        <ChevronRight size={16} className="ml-auto text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>
          </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="xl:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 absolute w-full shadow-lg h-[calc(100vh-80px)] overflow-y-auto">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <button onClick={() => handleNavClick('aktuelles')} className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-club-50">Start</button>
            <button onClick={() => handleNavClick('news-archive')} className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-club-50">Neuigkeiten</button>
            <button onClick={() => handleNavClick('calendar')} className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-club-50">Termine</button>
            <button onClick={() => handleNavClick('history')} className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-club-50">Chronik</button>
            
            <div className="px-3 py-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sportarten</span>
                <div className="mt-2 space-y-1">
                    {sports.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => handleSportClick(s.id)}
                            className="flex items-center gap-3 w-full p-2 rounded-lg text-slate-700 hover:bg-club-50 hover:text-club-600 transition-colors"
                        >
                            <span className="text-club-500/70 w-8 h-8">{s.icon}</span>
                            <span className="font-medium">{s.name}</span>
                        </button>
                    ))}
                </div>
            </div>

             <button
                onClick={() => handleNavClick('kontakt')}
                className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-club-50"
            >
                Kontakt
            </button>
            
            <button 
              className="block w-full text-center mt-4 px-3 py-3 rounded-lg text-base font-bold bg-club-red text-white hover:bg-club-red-hover transition-colors"
              onClick={() => {
                handleNavClick('membership');
                setIsMenuOpen(false);
              }}
            >
              Mitglied werden
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;