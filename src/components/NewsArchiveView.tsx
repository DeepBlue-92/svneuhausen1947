import React, { useState } from 'react';
import { ArrowLeft, Newspaper, Calendar, Tag, Maximize2, X, FileText } from 'lucide-react';
import { Post } from '../types';

interface NewsArchiveViewProps {
  posts: Post[];
  onBack: () => void;
}

const NewsArchiveView: React.FC<NewsArchiveViewProps> = ({ posts, onBack }) => {
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openPdf = (url: string) => {
      window.open(url, '_blank');
  };

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack}
            className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Newspaper className="text-club-600" /> News Archiv
            </h1>
            <p className="text-slate-500">Alle Meldungen und Berichte des SV Neuhausen.</p>
          </div>
        </div>

        <div className="space-y-8 max-w-6xl mx-auto">
          {sortedPosts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[24px] shadow-sm">
                  <p className="text-slate-400">Keine Beiträge gefunden.</p>
              </div>
          ) : (
              sortedPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row min-h-[240px]">
                          {/* Image Section - Now 50% width */}
                          {post.imageUrl && (
                              <div className="md:w-1/2 bg-slate-100 relative min-h-[300px] md:min-h-full group">
                                  <img 
                                    src={post.imageUrl} 
                                    alt={post.title} 
                                    className="absolute inset-0 w-full h-full object-contain" 
                                  />
                                  {/* Maximize Button Overlay */}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-start justify-end p-4">
                                      <button 
                                        onClick={() => setSelectedImage(post.imageUrl!)}
                                        className="bg-black/50 hover:bg-club-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg backdrop-blur-sm"
                                        title="Bild vergrößern"
                                      >
                                        <Maximize2 size={20} />
                                      </button>
                                  </div>
                              </div>
                          )}
                          
                          {/* Content Section - Now 50% width, full text visible */}
                          <div className={`p-6 md:p-8 flex flex-col justify-center ${!post.imageUrl ? 'w-full' : 'md:w-1/2'}`}>
                              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 mb-3">
                                  <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded text-slate-600 border border-slate-200">
                                      <Calendar size={12} />
                                      {new Date(post.date).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                  </span>
                                  <span className="flex items-center gap-1 bg-club-50 px-2 py-1 rounded text-club-700 border border-club-100 uppercase tracking-wide">
                                      <Tag size={12} />
                                      {post.departmentId === 'all' ? 'Verein' : post.departmentId}
                                  </span>
                              </div>

                              <h2 className="text-2xl font-bold text-slate-900 mb-4">{post.title}</h2>
                              
                              <div 
                                  className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed mb-4"
                                  dangerouslySetInnerHTML={{__html: post.content}}
                              ></div>

                              {post.pdfUrl && (
                                  <div className="mt-4">
                                      <button 
                                          onClick={() => openPdf(post.pdfUrl!)}
                                          className="inline-flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 px-4 py-2 rounded-xl font-bold text-sm transition-colors"
                                      >
                                          <FileText size={16} />
                                          PDF Anhang öffnen
                                      </button>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              ))
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={32} />
          </button>
          <img 
            src={selectedImage} 
            alt="Full size" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </>
  );
};

export default NewsArchiveView;