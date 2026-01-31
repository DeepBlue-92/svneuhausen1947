import React from 'react';
import { Calendar, Clock, ChevronRight, FileText, MapPin } from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarTileProps {
  events: CalendarEvent[];
  onNavigate?: () => void;
}

const CalendarTile: React.FC<CalendarTileProps> = ({ events, onNavigate }) => {
  // Sort events by date ascending, filter out past events
  const today = new Date();
  today.setHours(0,0,0,0);
  
  // Show only 3 events as requested (increased from 2, location removed to fit)
  const displayEvents = events
    .filter(e => new Date(e.startDate) >= today)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  return (
    <div className="col-span-1 bg-white rounded-[24px] shadow-sm p-5 border border-slate-100 flex flex-col h-full min-h-[340px] md:h-[380px] hover:border-club-100 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <div className="p-1.5 bg-club-50 rounded-lg text-club-600">
            <Calendar size={18} />
          </div>
          Termine
        </h2>
        <button 
            onClick={onNavigate}
            className="text-xs font-semibold text-club-600 hover:text-club-700 hover:underline flex items-center gap-1"
        >
          Alle Termine <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar">
        {displayEvents.length === 0 ? (
             <div className="h-full flex items-center justify-center">
                <p className="text-sm text-slate-400 italic">Keine anstehenden Termine.</p>
             </div>
        ) : (
            displayEvents.map((event, index) => {
            const dateObj = new Date(event.startDate);
            const month = dateObj.toLocaleDateString('de-DE', { month: 'short' }).replace('.', '').toUpperCase();
            const day = dateObj.getDate();
            const isNextEvent = index === 0;

            return (
            <div 
                key={event.id} 
                onClick={onNavigate}
                className="flex gap-3 items-center p-2 rounded-xl border border-transparent cursor-pointer hover:bg-slate-50 transition-colors group"
                title="Zum Kalender"
            >
                <div className="flex-shrink-0 flex flex-col items-center justify-center bg-club-50 text-club-700 rounded-xl w-12 h-12 border border-club-100/50 mt-0.5 group-hover:bg-white group-hover:border-club-200 transition-colors">
                    <span className="text-[9px] font-bold uppercase tracking-wide leading-none mb-0.5">{month}</span>
                    <span className="text-lg font-bold leading-none">{day}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug line-clamp-2 group-hover:text-club-600 transition-colors" title={event.title}>
                        {event.title}
                    </h4>
                    <div className="flex flex-col gap-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 shrink-0">
                            <Clock size={12} className="text-club-400" /> {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}
                        </span>
                        
                        {isNextEvent && (
                            <span className="flex items-center gap-1.5 shrink-0">
                                <MapPin size={12} className="text-club-400" /> {event.location}
                            </span>
                        )}

                        {event.pdfUrl && (
                            <a 
                                href={event.pdfUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 text-club-600 hover:text-club-700 font-medium mt-1 w-fit hover:underline"
                            >
                                <FileText size={12} />
                                Info-PDF öffnen
                            </a>
                        )}
                    </div>
                </div>
                <div className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={16} />
                </div>
            </div>
            )})
        )}
      </div>
    </div>
  );
};

export default CalendarTile;