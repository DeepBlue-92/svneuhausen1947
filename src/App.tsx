import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroTile from './components/HeroTile';
import NewsTile from './components/NewsTile';
import CalendarTile from './components/CalendarTile';
import ShopTile from './components/ShopTile';
import SponsorsTile from './components/SponsorsTile';
import LocationTile from './components/LocationTile';
import SportDetailView from './components/SportDetailView';
import ContactView from './components/ContactView';
import ImpressumView from './components/ImpressumView';
import DatenschutzView from './components/DatenschutzView';
import PartnersView from './components/PartnersView';
import ShopView from './components/ShopView';
import HistoryView from './components/HistoryView';
import MembershipView from './components/MembershipView';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import NewsArchiveView from './components/NewsArchiveView';
import CalendarView from './components/CalendarView';
import SubmissionView from './components/SubmissionView';
import TennisRulesView from './components/TennisRulesView';
import TennisTrainingView from './components/TennisTrainingView';
import { PageType, Partner, User, Post, CalendarEvent, GalleryImage } from './types';
import { Lock, LogOut } from 'lucide-react';
import { fetchData } from './utils/github';

// --- INITIAL DATA SEEDS ---
const DEFAULT_PARTNERS: Partner[] = [];

// Benutzerdaten (Sollten später in Umweltvariablen oder DB ausgelagert werden)
const DEFAULT_USERS: User[] = [
  { id: '1', username: 'admin', password: 'admin', displayName: 'Hauptadministrator', role: 'admin' },
  { id: '2', username: 'fußball', password: 'fußball', displayName: 'Abteilung Fußball', role: 'head', departmentId: 'fussball' },
  { id: '3', username: 'turndichfit', password: 'turndichfit', displayName: 'Turn dich Fit', role: 'head', departmentId: 'turndichfit' },
  { id: '4', username: 'kinderturnen', password: 'kinderturnen', displayName: 'Kinderturnen', role: 'head', departmentId: 'kinderturnen' },
  { id: '5', username: 'karate', password: 'karate', displayName: 'Karate', role: 'head', departmentId: 'karate' },
  { id: '6', username: 'schwertkampf', password: 'schwertkampf', displayName: 'Schwertkampf', role: 'head', departmentId: 'schwertkampf' },
];

const DEFAULT_POSTS: Post[] = [];
const DEFAULT_EVENTS: CalendarEvent[] = [];

const DEFAULT_GALLERY: GalleryImage[] = [
    { id: '1', title: 'Unsere Anlage von oben', imageUrl: '/tennisanlage1.jpg', departmentId: 'tennis' },
    { id: '3', title: 'Vereinsheim Terrasse', imageUrl: '/tennisheim1.jpg', departmentId: 'tennis' }
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('aktuelles');
  const [currentSportId, setCurrentSportId] = useState<string>('');
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Data State
  const [partners, setPartners] = useState<Partner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  // Load Data on Mount
  useEffect(() => {
    const load = async (key: string, setter: any, def: any, filename?: string, folder: string = 'data') => {
        let loadedData = null;

        if (filename) {
            const liveData = await fetchData(filename, folder);
            if (liveData && Array.isArray(liveData)) {
                loadedData = liveData;
                try {
                  localStorage.setItem(`svn_${key}`, JSON.stringify(liveData));
                } catch (e) {
                  console.warn(`LocalStorage quota exceeded.`);
                }
            }
        }

        if (!loadedData) {
            const stored = localStorage.getItem(`svn_${key}`);
            if (stored) {
                try { 
                  const parsed = JSON.parse(stored);
                  loadedData = (key === 'users' && (!parsed || parsed.length === 0)) ? def : parsed;
                } catch(e) { loadedData = def; }
            } else {
                loadedData = def;
            }
        }

        if (loadedData && Array.isArray(loadedData)) {
            if (key === 'posts') loadedData = loadedData.filter((p: Post) => p.title && p.title.toLowerCase() !== 'test');
            if (key === 'events') loadedData = loadedData.filter((e: CalendarEvent) => e.title && e.title.toLowerCase() !== 'test');
        }

        setter(loadedData);
    };
    
    load('partners', setPartners, DEFAULT_PARTNERS, 'sponsoren.json');
    load('users', setUsers, DEFAULT_USERS);
    load('posts', setPosts, DEFAULT_POSTS, 'posts.json');
    load('events', setEvents, DEFAULT_EVENTS, 'events.json');
    load('gallery', setGalleryImages, DEFAULT_GALLERY, 'gallery.json');
  }, []);

  const updateStore = (key: string, data: any, setter: any) => {
      setter(data);
      try {
        localStorage.setItem(`svn_${key}`, JSON.stringify(data));
      } catch (e) {
        console.warn(`LocalStorage error.`);
      }
  };

  const handleSportSelect = (sportId: string) => {
    setCurrentSportId(sportId);
    setCurrentPage('sport-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const publicPosts = posts.filter(p => p.status === 'approved' || p.status === undefined);
  const publicEvents = events.filter(e => e.status === 'approved' || e.status === undefined);

  const renderContent = () => {
    switch (currentPage) {
      case 'admin-dashboard':
        return currentUser ? (
           <AdminDashboard 
             currentUser={currentUser}
             users={users}
             posts={posts}
             events={events}
             galleryImages={galleryImages}
             partners={partners}
             onUpdateUsers={(u) => updateStore('users', u, setUsers)}
             onUpdatePosts={(p) => updateStore('posts', p, setPosts)}
             onUpdateEvents={(e) => updateStore('events', e, setEvents)}
             onUpdateGallery={(g) => updateStore('gallery', g, setGalleryImages)}
             onUpdatePartners={(p) => updateStore('partners', p, setPartners)}
           />
        ) : <div className="text-center py-20">Zugriff verweigert.</div>;
      case 'submission':
          return <SubmissionView 
                  onSubmitPost={(p) => updateStore('posts', [p, ...posts], setPosts)}
                  onSubmitEvent={(e) => updateStore('events', [e, ...events], setEvents)}
                  onBack={() => handlePageChange('aktuelles')}
              />;
      case 'sport-detail':
        return <SportDetailView sportId={currentSportId} posts={publicPosts} events={publicEvents} galleryImages={galleryImages} onNavigate={handlePageChange} />;
      case 'tennis-rules':
        return <TennisRulesView onBack={() => handlePageChange('sport-detail')} />;
      case 'tennis-training':
        return <TennisTrainingView onBack={() => handlePageChange('sport-detail')} onNavigate={handlePageChange} />;
      case 'kontakt': return <ContactView />;
      case 'impressum': return <ImpressumView />;
      case 'datenschutz': return <DatenschutzView />;
      case 'shop': return <ShopView onBack={() => handlePageChange('aktuelles')} />;
      case 'history': return <HistoryView />;
      case 'membership': return <MembershipView />;
      case 'news-archive': return <NewsArchiveView posts={publicPosts} onBack={() => handlePageChange('aktuelles')} />;
      case 'calendar': return <CalendarView events={publicEvents} onBack={() => handlePageChange('aktuelles')} />;
      case 'partner':
        return <PartnersView isAdmin={currentUser?.role === 'admin'} partners={partners} onAddPartner={(p) => updateStore('partners', [...partners, p], setPartners)} onUpdatePartner={(p) => updateStore('partners', partners.map(x => x.id === p.id ? p : x), setPartners)} onRemovePartner={(id) => updateStore('partners', partners.filter(x => x.id !== id), setPartners)} />;
      case 'aktuelles':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto animate-in fade-in duration-500">
            <HeroTile onNavigate={() => handlePageChange('membership')} />
            <CalendarTile events={publicEvents} onNavigate={() => handlePageChange('calendar')} />
            <NewsTile posts={publicPosts} onNavigate={() => handlePageChange('news-archive')} />
            <SponsorsTile onNavigate={() => handlePageChange('partner')} partners={partners} />
            <LocationTile />
            <ShopTile onNavigate={() => handlePageChange('shop')} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-club-200 selection:text-club-900 font-sans">
      <Header currentPage={currentPage} onNavigate={handlePageChange} onSportSelect={handleSportSelect} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">{renderContent()}</main>
      <footer className="bg-white border-t border-slate-200 mt-auto relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div className="text-slate-700 space-y-1">
               <h3 className="font-bold text-slate-900">SV Neuhausen Sportgelände</h3>
               <p>84107 Unterneuhausen</p>
               <p>Bräu-Taferl-Weg 3</p>
               <p className="text-club-700 font-medium pt-1">Telefon Sportheim: 08708 - 603</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm font-medium text-slate-600 items-center">
              <button className="hover:text-club-600 transition-colors" onClick={() => handlePageChange('impressum')}>Impressum</button>
              <button className="hover:text-club-600 transition-colors" onClick={() => handlePageChange('datenschutz')}>Datenschutz</button>
              <div className="h-4 w-px bg-slate-300 hidden md:block"></div>
              {!currentUser ? (
                <button onClick={() => setIsLoginOpen(true)} className="flex items-center gap-1.5 text-slate-500 hover:text-club-600 transition-colors"><Lock size={14} /> Intern</button>
              ) : (
                <div className="flex items-center gap-3">
                    <button onClick={() => handlePageChange('admin-dashboard')} className={`font-bold transition-colors ${currentPage === 'admin-dashboard' ? 'text-club-600' : 'text-slate-800 hover:text-club-600'}`}>Dashboard</button>
                    <button onClick={() => { setCurrentUser(null); handlePageChange('aktuelles'); }} className="flex items-center gap-1.5 text-red-600 font-bold hover:text-red-800 transition-colors bg-red-50 px-3 py-1 rounded-full"><LogOut size={14} /> Abmelden</button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100 text-center text-xs text-slate-500">&copy; {new Date().getFullYear()} SV Neuhausen e.V.</div>
        </div>
      </footer>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} users={users} onLogin={(user) => { setCurrentUser(user); handlePageChange('admin-dashboard'); }} />
    </div>
  );
};

export default App;