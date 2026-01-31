import React from 'react';
import { BookOpen, Flag } from 'lucide-react';

interface HistoryTileProps {
  onNavigate?: () => void;
}

const HistoryTile: React.FC<HistoryTileProps> = ({ onNavigate }) => {
  return (
    <div className="col-span-1 bg-white rounded-[24px] shadow-sm p-6 border border-slate-100 flex flex-col h-full min-h-[200px] hover:border-club-100 transition-colors group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <div className="p-2 bg-club-50 rounded-lg text-club-600">
            <BookOpen size={20} />
          </div>
          Chronik
        </h2>
      </div>
      
      <div className="flex-1 relative">
         <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-slate-100"></div>
         <div className="space-y-4 pl-6 relative">
             <div className="relative">
                 <div className="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full bg-club-600 ring-4 ring-white"></div>
                 <p className="text-sm font-bold text-slate-800">1947</p>
                 <p className="text-xs text-slate-500">Gründung des Vereins</p>
             </div>
             <div className="relative">
                 <div className="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full bg-club-200 ring-4 ring-white group-hover:bg-club-400 transition-colors"></div>
                 <p className="text-sm font-bold text-slate-800">2024</p>
                 <p className="text-xs text-slate-500">70+ Jahre Tradition</p>
             </div>
         </div>
      </div>

      <button 
        onClick={onNavigate}
        className="mt-4 w-full py-2 text-sm font-medium text-slate-500 hover:text-club-600 transition-colors flex items-center justify-center gap-1 hover:bg-slate-50 rounded-lg"
      >
         Ganze Geschichte lesen
      </button>
    </div>
  );
};

export default HistoryTile;