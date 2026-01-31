import React from 'react';
import { ArrowLeft, Shirt, Phone, User, Info } from 'lucide-react';

interface ShopViewProps {
  onBack: () => void;
}

const products = [
  {
    id: 1,
    name: 'Kappe',
    price: '25,00 €',
    image: 'https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/336543d990ef3011d0a36f11b812dd9f66fa3004/kappe1.png', 
    desc: 'Mit gesticktem Wappen und Slogan.'
  },
  {
    id: 2,
    name: 'Fanschal',
    price: '25,00 €',
    image: 'https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/336543d990ef3011d0a36f11b812dd9f66fa3004/schal1.png', 
    desc: 'Hochwertiger Strickschal in Vereinsfarben.'
  },
  {
    id: 3,
    name: 'T-Shirt',
    price: '25,00 €',
    image: 'https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/336543d990ef3011d0a36f11b812dd9f66fa3004/t-shirt1.png',
    desc: 'Atmungsaktiv, ideal für Sport und Freizeit.'
  },
  {
    id: 4,
    name: 'Bierkrug',
    price: '25,00 €',
    image: 'https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/336543d990ef3011d0a36f11b812dd9f66fa3004/Bierkrug1.png',
    desc: 'Traditioneller Steinkrug mit Wappen.'
  },
  {
    id: 5,
    name: 'Tasse',
    price: '10,00 €',
    image: 'https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/336543d990ef3011d0a36f11b812dd9f66fa3004/tasse1.png',
    desc: 'Keramiktasse für den perfekten Start in den Tag.'
  },
];

const ShopView: React.FC<ShopViewProps> = ({ onBack }) => {
  return (
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
             <Shirt className="text-club-600" /> Fanartikel Übersicht
           </h1>
           <p className="text-slate-500">Zeig deine Farben mit der offiziellen Kollektion.</p>
        </div>
      </div>

      {/* Contact / Order Info Box - Simplified without disclaimer text */}
      <div className="bg-club-50 rounded-[24px] p-6 border border-club-100 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
         <div className="flex items-center gap-6">
             <div className="p-4 bg-white rounded-full shadow-sm text-club-600 shrink-0">
                <User size={32} />
             </div>
             <div>
                <h3 className="text-lg font-bold text-club-900 mb-1">Interesse an einem Artikel?</h3>
                <p className="text-slate-600 text-sm">
                    Verkauf und Bestellung erfolgt direkt über <strong>Michael Potempa</strong>.<br/>
                    Kein Online-Versand möglich.
                </p>
             </div>
         </div>
         <a href="tel:01711442535" className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl border border-club-200 text-slate-700 hover:text-club-600 hover:border-club-400 hover:shadow-md transition-all group">
            <Phone size={20} className="text-club-400 group-hover:text-club-600" />
            <span className="font-bold text-lg">0171 - 1442535</span>
         </a>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
            <div key={product.id} className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:border-club-200 transition-all duration-300 group flex flex-col">
                <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg font-bold text-club-600 shadow-sm">
                        {product.price}
                    </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
                    <p className="text-slate-600 text-sm flex-1">{product.desc}</p>
                </div>
            </div>
        ))}
      </div>

    </div>
  );
};

export default ShopView;