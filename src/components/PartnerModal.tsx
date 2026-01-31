import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Save, Image as ImageIcon } from 'lucide-react';
import { Partner } from '../types';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partner: Partner) => void;
  initialData?: Partner | null;
}

const PartnerModal: React.FC<PartnerModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setImageUrl(initialData.imageUrl);
      } else {
        // Reset for new entry
        setName('');
        setImageUrl(undefined);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        // Auto-fill name if empty
        if (!name) {
          setName(file.name.split('.')[0]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPartner: Partner = {
      id: initialData ? initialData.id : Date.now().toString(),
      name,
      description: '', // Description removed
      imageUrl,
      placeholderColor: initialData?.placeholderColor // Keep existing color if editing demo data
    };
    onSave(newPartner);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? 'Partner bearbeiten' : 'Neuen Partner hinzufügen'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="partnerForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload Area */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Logo / Bild</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group ${imageUrl ? 'border-club-200 bg-slate-50' : 'border-slate-300 hover:border-club-400 hover:bg-club-50'}`}
              >
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-contain p-4" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                      Bild ändern
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-400 group-hover:text-club-600">
                    <ImageIcon size={32} className="mx-auto mb-2" />
                    <span className="text-sm">Klicken zum Hochladen</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Inputs */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Name des Partners</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-club-500/20 focus:border-club-500 transition-all font-medium"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Musterfirma GmbH"
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Abbrechen
          </button>
          <button 
            type="submit"
            form="partnerForm"
            className="px-5 py-2.5 rounded-xl font-semibold text-white bg-club-600 hover:bg-club-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save size={18} /> Speichern
          </button>
        </div>

      </div>
    </div>
  );
};

export default PartnerModal;