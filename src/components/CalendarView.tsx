import React, { useState } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, MapPin, Clock, Filter, ChevronRight, X, FileText } from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  onBack: () => void;
}

const DEPARTMENTS = [
  { id: 'all', name: 'Alle', color: 'bg-slate-100 text-slate-700' },
  { id: 'fussball', name: 'Fußball', color: 'bg-green-100 text-green-800' },
  { id: 'karate', name: 'Karate', color: 'bg-red-100 text-red-800' },
  { id: 'kinderfussball', name: 'Kinderfußball', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'kinderturnen', name: 'Kinderturnen', color: 'bg-purple-100 text-purple-800' },
  { id: 'schwertkampf', name: 'Schwertkampf', color: 'bg-slate-800 text-slate-100' },
  { id: 'tennis', name: 'Tennis', color: 'bg-amber-100 text-amber-800' },
  { id: 'turndichfit', name: 'Turn dich fit', color: 'bg-pink-100 text-pink-800' },
];

const getDepartmentLabel = (id: string) => {
    const dept = DEPARTMENTS.find(d => d.id === id);
    return dept ? dept.name : id;
};

const getDepartmentColor = (id: string) => {
    const dept = DEPARTMENTS.find(d => d.id === id);
    return dept ? dept.color : 'bg-slate-100 text-slate-600';
};

const CalendarView: React.FC<CalendarViewProps> = ({ events, onBack }) => {
  const [filter, setFilter] = useState('all');

  // 1. Filter events
  const filteredEvents = events.filter(e => {
      if (filter === 'all') return true;
      if (filter === 'fussball') return e.departmentId === 'fussball' || e.departmentId === 'kinderfussball'; // Group soccer
      return e.departmentId === filter;
  });

  // 2. Sort by Date
  const sortedEvents = [...filteredEvents].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // 3. Group by Month
  const groupedEvents: Record<string, CalendarEvent[]> = {};
  
  sortedEvents.forEach(event => {
      const date = new Date(event.startDate);
      // Skip past events (optional, but usually desired for a "Coming up" calendar)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date >= yesterday) {
        const key = date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
        if (!groupedEvents[key]) {
            groupedEvents[key] = [];
        }
        groupedEvents[key].push(event);
      }
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shrink-0"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
           <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
             <CalendarIcon className="text-club-600" /> Veranstaltungskalender
           </h1>
           <p className="text-slate-500 mt-1">
               Alle Termine, Spiele und Events des SV Neuhausen auf einen Blick.
           </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] shadow-sm border border-slate-100 mb-8 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <div className="mr-2 text-slate-400 flex items-center gap-1 text-sm font-medium">
                <Filter size={16} /> Filter:
            </div>
            {DEPARTMENTS.filter(d => d.id !== 'kinderfussball').map(dept => (
                <button
                    key={dept.id}
                    onClick={() => setFilter(dept.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                        filter === dept.id 
                        ? 'bg-club-600 text-white shadow-md' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    {dept.name}
                </button>
            ))}
          </div>
      </div>

      {/* Calendar List */}
      <div className="space-y-10 max-w-4xl mx-auto">
        {Object.keys(groupedEvents).length === 0 ? (
             <div className="text-center py-20 bg-white rounded-[24px] shadow-sm border border-slate-100">
                <CalendarIcon size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Keine Termine gefunden</h3>
                <p className="text-slate-500">Für die gewählte Auswahl sind aktuell keine Veranstaltungen eingetragen.</p>
                {filter !== 'all' && (
                    <button 
                        onClick={() => setFilter('all')}
                        className="mt-6 text-club-600 font-bold hover:underline"
                    >
                        Filter zurücksetzen
                    </button>
                )}
            </div>
        ) : (
            Object.entries(groupedEvents).map(([month, events]) => (
                <div key={month} className="relative">
                    {/* Month Header - Sticky */}
                    <div className="sticky top-20 z-10 py-3 bg-slate-100/95 backdrop-blur-sm mb-4 border-b border-slate-200/50 flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-club-600"></div>
                        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">{month}</h2>
                    </div>

                    <div className="grid gap-4">
                        {events.map((event) => {
                            const dateObj = new Date(event.startDate);
                            const day = dateObj.getDate();
                            const weekday = dateObj.toLocaleDateString('de-DE', { weekday: 'short' });
                            
                            return (
                                <div key={event.id} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 md:items-center">
                                    
                                    {/* Date Box */}
                                    <div className="flex md:flex-col items-center justify-between md:justify-center bg-slate-50 rounded-xl p-3 md:w-20 md:h-20 shrink-0 border border-slate-100 transition-colors">
                                        <span className="text-sm font-medium text-slate-500 uppercase">{weekday}</span>
                                        <span className="text-2xl font-bold text-slate-900">{day}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getDepartmentColor(event.departmentId)}`}>
                                                {getDepartmentLabel(event.departmentId)}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{event.title}</h3>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-club-400" />
                                                {event.startTime} {event.endTime ? `- ${event.endTime}` : ''} Uhr
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={14} className="text-club-400" />
                                                {event.location}
                                            </div>
                                            {event.pdfUrl && (
                                                <div className="flex items-center gap-1.5">
                                                    <a href={event.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-0.5 rounded hover:bg-red-100 transition-colors">
                                                        <FileText size={12} />
                                                        PDF Info
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default CalendarView;