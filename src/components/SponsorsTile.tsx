import React, { useState, useEffect } from 'react';
import { Handshake, Star } from 'lucide-react';
import { Partner } from '../types';

interface SponsorsTileProps {
  onNavigate: () => void;
  partners: Partner[];
}

const SponsorsTile: React.FC<SponsorsTileProps> = ({ onNavigate, partners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safety check if partners array is empty
  const hasPartners = partners.length > 0;

  useEffect(() => {
    if (!hasPartners) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % partners.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [partners.length, hasPartners]);

  return (
    <div 
      onClick={onNavigate}
      className="col-span-1 bg-club-gold rounded-[24px] shadow-sm p-6 border border-orange-100 flex flex-col h-full min-h-[220px] group hover:border-club-gold-dark/30 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="relative z-10 flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <div className="p-2 bg-white/60 rounded-lg text-club-gold-dark backdrop-blur-sm">
            <Handshake size={20} />
          </div>
          Partner
        </h2>
        <div className="bg-white/40 px-2 py-1 rounded text-xs font-bold text-club-gold-dark uppercase tracking-wider">
            Unterstützer
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative w-full">
         {/* Carousel Container - Expanded to fill available space */}
         {hasPartners ? (
            <div className="w-full h-full relative flex items-center justify-center p-2">
                {partners.map((partner, index) => (
                    <div 
                        key={partner.id}
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 transform ${
                            index === currentIndex 
                            ? 'opacity-100 translate-y-0 scale-100' 
                            : 'opacity-0 translate-y-4 scale-95'
                        }`}
                    >
                        {partner.imageUrl ? (
                             <img 
                                src={partner.imageUrl} 
                                alt={partner.name} 
                                className="w-full h-full object-contain drop-shadow-sm"
                             />
                        ) : (
                             // Fallback for default demo data
                            <div className={`w-full h-full max-h-[120px] rounded-xl flex items-center justify-center shadow-sm border border-white/50 px-4 text-center font-bold text-lg ${partner.placeholderColor || 'bg-white/50 text-slate-800'}`}>
                                {partner.name}
                            </div>
                        )}
                       
                    </div>
                ))}
            </div>
         ) : (
             <div className="text-club-gold-dark/50 text-sm font-medium">Werde Partner!</div>
         )}
      </div>
      
      <div className="mt-2 flex justify-between items-center text-sm font-semibold text-club-gold-dark/80 group-hover:text-club-gold-dark transition-colors relative z-10">
        <span>Alle Partner ansehen</span>
        {hasPartners && (
            <div className="flex gap-1">
                {partners.slice(0, 5).map((_, idx) => ( // Only show up to 5 dots to avoid overflow
                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === (currentIndex % 5) ? 'w-4 bg-club-gold-dark' : 'w-1.5 bg-club-gold-dark/30'}`} />
                ))}
            </div>
        )}
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute -bottom-6 -right-6 text-white/20 rotate-12 pointer-events-none">
        <Star size={100} fill="currentColor" />
      </div>
    </div>
  );
};

export default SponsorsTile;