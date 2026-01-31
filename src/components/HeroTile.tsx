import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroTileProps {
  onNavigate?: () => void;
}

const HeroTile: React.FC<HeroTileProps> = ({ onNavigate }) => {
  return (
    <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-[24px] shadow-lg group h-full min-h-[340px] md:h-[380px] flex flex-col justify-center p-8 md:p-12 border border-white/20">
      
      {/* Background Image (No Zoom Effect) */}
      <img 
        src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2000&auto=format&fit=crop" 
        alt="Sport Background" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Modern Dark Glass Overlay */}
      <div className="absolute inset-0 bg-slate-900/40"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-club-900/95 via-club-900/80 to-club-800/30 backdrop-blur-sm"></div>
      
      {/* Subtle Noise/Texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      {/* Decorative Watermark (No Hover Effect) */}
      <div className="absolute -right-12 -bottom-12 opacity-10 md:opacity-5 pointer-events-none transform rotate-12">
         <img 
            src="https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/4d546746461cb1b039a35dbfbc61da86aca6f485/Wappen.png" 
            alt="Watermark" 
            className="w-64 h-64 grayscale"
         />
      </div>

      <div className="relative z-10 w-full flex items-center justify-between gap-8">
        
        {/* Left Side: Content */}
        <div className="max-w-lg text-white">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 tracking-tight drop-shadow-sm">
            Willkommen beim <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-club-200">SV Neuhausen</span>
          </h1>
          
          <p className="text-club-100 text-lg mb-8 leading-relaxed max-w-md font-medium border-l-2 border-club-400 pl-4">
            Leidenschaft, Teamgeist und Tradition seit 1947. Entdecke unser vielfältiges Sportangebot für die ganze Familie.
          </p>
          
          <button 
            onClick={onNavigate}
            className="inline-flex items-center gap-2 bg-white text-club-900 hover:bg-club-50 font-bold py-3.5 px-7 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Jetzt Mitglied werden
            <ArrowRight size={20} className="text-club-600" />
          </button>
        </div>

        {/* Right Side: Featured Logo (No Hover Effect) */}
        <div className="hidden md:block relative animate-in fade-in slide-in-from-right-8 duration-1000">
           <div className="relative z-10">
              <img 
                src="https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/4d546746461cb1b039a35dbfbc61da86aca6f485/Wappen.png" 
                alt="SV Neuhausen Wappen" 
                className="w-48 h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
              />
           </div>
           {/* Glow behind logo */}
           <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full -z-10"></div>
        </div>

      </div>
      
    </div>
  );
};

export default HeroTile;