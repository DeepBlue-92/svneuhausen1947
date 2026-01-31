import React from 'react';
import { MapPin } from 'lucide-react';

const LocationTile: React.FC = () => {
  return (
    <div className="col-span-1 bg-white rounded-[24px] shadow-sm p-6 border border-slate-100 flex flex-col h-full min-h-[350px] md:min-h-[200px] hover:border-club-100 transition-colors group overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <div className="p-2 bg-club-50 rounded-lg text-club-600">
            <MapPin size={20} />
          </div>
          Anfahrt
        </h2>
      </div>
      
      <div className="flex-1 relative rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
          <iframe 
            src="https://maps.google.com/maps?q=SV%20Neuhausen%20eV%2C%20Br%C3%A4u-Taferl-Weg%203%2C%2084107%20Weihmichl&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full grayscale-[50%] group-hover:grayscale-0 transition-all duration-500"
          ></iframe>
      </div>

      <div className="mt-4 flex flex-col text-sm">
         <strong className="text-slate-900">SV Neuhausen e.V.</strong>
         <span className="text-slate-500">Bräu-Taferl-Weg 3, 84107 Weihmichl</span>
      </div>
    </div>
  );
};

export default LocationTile;