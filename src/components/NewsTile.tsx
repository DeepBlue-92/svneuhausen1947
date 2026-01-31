import React from 'react';
import { Newspaper, ChevronRight, ArrowRight, Calendar, Tag, FileText } from 'lucide-react';
import { Post } from '../types';

interface NewsTileProps {
  posts: Post[];
  onNavigate: () => void;
}

const NewsTile: React.FC<NewsTileProps> = ({ posts, onNavigate }) => {
  // Sort by date desc
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const latestPost = sortedPosts[0];
  const recentPosts = sortedPosts.slice(1, 4);

  const openPdf = (e: React.MouseEvent, url: string) => {
      e.stopPropagation();
      window.open(url, '_blank');
  };

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-[24px] shadow-sm p-0 border border-slate-100 flex flex-col h-full min-h-[300px] hover:border-club-100 transition-colors duration-300 overflow-hidden group">
      
      {/* Header */}
      <div className="px-6 pt-6 flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <div className="p-2 bg-club-50 rounded-lg text-club-600">
            <Newspaper size={20} />
          </div>
          Neuigkeiten
        </h2>
        <button 
          onClick={onNavigate}
          className="text-xs font-semibold text-club-600 hover:text-club-700 hover:underline flex items-center gap-1"
        >
          Alle Meldungen <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex-1 p-6 pt-2">
        {latestPost ? (
            <div className="flex flex-col md:flex-row gap-8 h-full">
                
                {/* Featured Post (Latest) - New Layout: Stacked (Meta -> Title -> Image -> Text) */}
                <div 
                    className="flex-1 flex flex-col gap-4 cursor-pointer group/featured"
                    onClick={onNavigate}
                >
                     {/* 1. Meta Data */}
                     <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                        <span className="bg-club-50 text-club-700 px-2 py-1 rounded border border-club-100 uppercase tracking-wide flex items-center gap-1">
                            <Tag size={12} />
                            {latestPost.departmentId === 'all' ? 'Verein' : latestPost.departmentId}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(latestPost.date).toLocaleDateString()}
                        </span>
                    </div>

                    {/* 2. Headline */}
                    <h3 className="text-xl md:text-2xl font-bold leading-tight group-hover/featured:text-club-600 transition-colors">
                        {latestPost.title}
                    </h3>

                    {/* 3. Image (Between Headline and Text) - Landscape Friendly */}
                    {latestPost.imageUrl && (
                        <div className="w-full rounded-xl overflow-hidden shadow-sm border border-slate-100 relative">
                            <img 
                                src={latestPost.imageUrl} 
                                alt={latestPost.title} 
                                className="w-full h-auto max-h-[400px] object-cover"
                            />
                        </div>
                    )}

                    {/* 4. Text Content */}
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        <span dangerouslySetInnerHTML={{__html: latestPost.content.replace(/<[^>]*>?/gm, '')}}></span>
                    </p>

                    {/* 5. Buttons */}
                    <div className="mt-auto pt-2 flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-club-600 group-hover/featured:translate-x-1 transition-transform">
                            Weiterlesen <ArrowRight size={16} />
                        </div>
                        {latestPost.pdfUrl && (
                            <button 
                                onClick={(e) => openPdf(e, latestPost.pdfUrl!)}
                                className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors border border-red-100"
                            >
                                <FileText size={14} /> PDF ansehen
                            </button>
                        )}
                    </div>
                </div>

                {/* Sidebar List (Next 3 posts) */}
                <div className="md:w-1/3 flex flex-col gap-3 border-l border-slate-50 md:pl-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Weitere Schlagzeilen</h4>
                    {recentPosts.length > 0 ? (
                        recentPosts.map(post => (
                            <div 
                                key={post.id} 
                                onClick={onNavigate}
                                className="group/item cursor-pointer py-3 border-b border-slate-50 last:border-0"
                            >
                                <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1">
                                    <Calendar size={10} />
                                    {new Date(post.date).toLocaleDateString()}
                                </div>
                                <h5 className="text-sm font-semibold text-slate-700 group-hover/item:text-club-600 leading-snug line-clamp-2 transition-colors">
                                    {post.title}
                                </h5>
                            </div>
                        ))
                    ) : (
                        <div className="text-slate-400 text-sm italic py-4">Keine weiteren Meldungen.</div>
                    )}
                    
                    <button 
                        onClick={onNavigate}
                        className="mt-auto w-full py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-club-50 hover:text-club-600 rounded-lg transition-colors text-center"
                    >
                        Zum News-Archiv
                    </button>
                </div>

            </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[200px]">
                <p>Aktuell keine Neuigkeiten.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default NewsTile;