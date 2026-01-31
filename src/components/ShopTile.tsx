import React from 'react';
import { Shirt, ChevronRight, Eye } from 'lucide-react';

interface ShopTileProps {
  onNavigate: () => void;
}

const ShopTile: React.FC<ShopTileProps> = ({ onNavigate }) => {
  return (
    <div 
      onClick={onNavigate}
      className="col-span-1 bg-club-600 rounded-[24px] shadow-sm p-6 border border-club-700 flex flex-col justify-between h-full min-h-[200px] group relative overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Background Image: Football on Grass */}
      <img 
        src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1000&auto=format&fit=crop" 
        alt="Background Texture" 
        className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500 mix-blend-overlay"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-club-900/90 to-club-600/70"></div>
      
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-white/20 rounded-lg text-white backdrop-blur-sm border border-white/10">
            <Shirt size={20} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-club-200 flex items-center gap-1 group-hover:text-white transition-colors">
            Kollektion <ChevronRight size={14} />
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-1">Fanartikel</h2>
        <p className="text-club-100 text-sm group-hover:text-white transition-colors mb-3">Zeig deine Farben!</p>
        
        {/* Preview Image - Adjusted scaling to show full image */}
        <div className="overflow-hidden rounded-xl border border-white/20 shadow-sm relative flex-1 min-h-[140px] bg-white">
            <img 
                src="https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/336543d990ef3011d0a36f11b812dd9f66fa3004/fanartikel_%C3%BCbersicht.jpg" 
                alt="Artikel Vorschau" 
                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
            />
        </div>
      </div>

      <div className="relative z-10 flex items-end justify-between mt-4">
        {/* Decorative Element */}
        <div className="bg-white/10 p-2 rounded-lg text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
           <Eye size={20} />
        </div>
        
        <button className="text-sm font-semibold text-white bg-white/20 hover:bg-white hover:text-club-600 px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/10">
          Zur Übersicht
        </button>
      </div>
    </div>
  );
};

export default ShopTile;