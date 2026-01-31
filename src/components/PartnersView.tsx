import React, { useState } from 'react';
import { Handshake, Trash2, Image as ImageIcon, Plus, Pencil } from 'lucide-react';
import { Partner } from '../types';
import PartnerModal from './PartnerModal';

interface PartnersViewProps {
  isAdmin: boolean;
  partners: Partner[];
  onAddPartner: (partner: Partner) => void;
  onUpdatePartner: (partner: Partner) => void;
  onRemovePartner: (id: string) => void;
}

const PartnersView: React.FC<PartnersViewProps> = ({ isAdmin, partners, onAddPartner, onUpdatePartner, onRemovePartner }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const handleEditClick = (partner: Partner) => {
    setEditingPartner(partner);
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingPartner(null);
    setIsModalOpen(true);
  };

  const handleSave = (partner: Partner) => {
    if (editingPartner) {
      onUpdatePartner(partner);
    } else {
      onAddPartner(partner);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* CMS Header Section */}
      <div className="bg-club-gold rounded-[24px] shadow-sm p-6 mb-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute -right-10 -top-10 text-white/20 rotate-12">
            <Handshake size={200} strokeWidth={1} />
        </div>
        <div className="relative z-10 max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Unsere Partner</h1>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed max-w-2xl">
                Wir danken unseren Sponsoren und Partnern für die großzügige Unterstützung. 
                Ohne dieses Engagement wäre unser Vereinsleben und die Jugendarbeit nicht möglich.
            </p>
        </div>
        
        {!isAdmin && (
             <button className="relative z-10 bg-white hover:bg-club-gold-dark hover:text-white text-club-gold-dark font-semibold py-2 px-5 text-sm rounded-xl transition-all shadow-sm border border-white/50 whitespace-nowrap">
                Sponsor werden
            </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {isAdmin && (
           <div 
             onClick={handleAddNewClick}
             className="min-h-[250px] bg-slate-50 rounded-[24px] border-2 border-dashed border-slate-200 hover:border-club-300 hover:bg-club-50 flex flex-col items-center justify-center text-slate-400 hover:text-club-600 cursor-pointer transition-all group"
           >
              <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <Plus size={32} />
              </div>
              <span className="text-sm font-bold">Neuen Partner hinzufügen</span>
           </div>
        )}

        {partners.map((partner) => (
          <div 
            key={partner.id} 
            className="group relative bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
          >
            {/* Image Section - Increased height and reduced padding for maximum visibility */}
            <div className="h-56 p-4 flex items-center justify-center bg-white border-b border-slate-50 relative">
                 {partner.imageUrl ? (
                  <img 
                    src={partner.imageUrl} 
                    alt={partner.name} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className={`w-full h-full rounded-xl flex items-center justify-center text-center font-bold text-lg p-4 ${partner.placeholderColor || 'bg-slate-100 text-slate-500'}`}>
                    {partner.name}
                  </div>
                )}
                
                {/* Admin Overlay controls */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2">
                     <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(partner);
                      }}
                      className="bg-white/90 text-slate-600 hover:text-club-600 p-2 rounded-lg shadow-sm border border-slate-200 hover:border-club-200 transition-all backdrop-blur-sm"
                      title="Bearbeiten"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if(confirm('Partner wirklich löschen?')) onRemovePartner(partner.id);
                      }}
                      className="bg-white/90 text-red-500 hover:text-red-600 p-2 rounded-lg shadow-sm border border-slate-200 hover:border-red-200 transition-all backdrop-blur-sm"
                      title="Löschen"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
            </div>

            {/* Text Section - Just the name now */}
            <div className="p-4 flex items-center justify-center bg-slate-50/30 flex-1">
                <h3 className="font-bold text-lg text-slate-900 text-center leading-tight">{partner.name}</h3>
            </div>
          </div>
        ))}
        
        {!isAdmin && partners.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-[24px]">
                <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p>Noch keine Partner vorhanden.</p>
            </div>
        )}
      </div>

      <PartnerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingPartner}
      />
    </div>
  );
};

export default PartnersView;