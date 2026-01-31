import React, { useState, useRef } from 'react';
import { Send, Calendar, FileText, Info, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Post, CalendarEvent } from '../types';

interface SubmissionViewProps {
  onSubmitPost: (post: Post) => void;
  onSubmitEvent: (event: CalendarEvent) => void;
  onBack: () => void;
}

const DEPARTMENTS = [
  { id: 'all', name: 'Allgemein / Hauptverein' },
  { id: 'fussball', name: 'Fußball' },
  { id: 'kinderfussball', name: 'Kinderfußball' },
  { id: 'tennis', name: 'Tennis' },
  { id: 'karate', name: 'Karate' },
  { id: 'kinderturnen', name: 'Kinderturnen' },
  { id: 'turndichfit', name: 'Turn dich fit' },
  { id: 'schwertkampf', name: 'Schwertkampf' },
];

const SubmissionView: React.FC<SubmissionViewProps> = ({ onSubmitPost, onSubmitEvent, onBack }) => {
  const [activeTab, setActiveTab] = useState<'post' | 'event'>('post');
  const [submitted, setSubmitted] = useState(false);
  
  // Post State
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postAuthor, setPostAuthor] = useState('');
  const [postDate, setPostDate] = useState(new Date().toISOString().slice(0, 10));
  const [postDept, setPostDept] = useState('all');
  const [postImage, setPostImage] = useState('');

  // Event State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [eventLocation, setEventLocation] = useState('Sportgelände');
  const [eventDept, setEventDept] = useState('all');

  const postImageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setPostImage(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const sendEmailNotification = (type: string, title: string, author: string) => {
      const subject = encodeURIComponent(`Neuer Antrag: ${type} - ${title}`);
      const body = encodeURIComponent(
          `Hallo Patrick,\n\nes wurde ein neuer ${type} eingereicht.\n\nTitel: ${title}\nVon: ${author}\n\nBitte im Admin-Dashboard prüfen und freigeben.\n\nViele Grüße,\nSV Neuhausen Web`
      );
      window.location.href = `mailto:patrick.taglinger@gmx.de?subject=${subject}&body=${body}`;
  };

  const handleSubmitPost = (e: React.FormEvent) => {
      e.preventDefault();
      const newPost: Post = {
          id: Date.now().toString(),
          title: postTitle,
          content: postContent.replace(/\n/g, '<br />'),
          imageUrl: postImage,
          date: new Date(postDate).toISOString(),
          departmentId: postDept,
          authorId: 'public_submission',
          author: postAuthor,
          status: 'pending'
      };
      onSubmitPost(newPost);
      sendEmailNotification('Bericht', postTitle, postAuthor);
      setSubmitted(true);
  };

  const handleSubmitEvent = (e: React.FormEvent) => {
      e.preventDefault();
      const newEvent: CalendarEvent = {
          id: Date.now().toString(),
          title: eventTitle,
          startDate: eventDate,
          startTime: eventStart,
          endTime: eventEnd || undefined,
          location: eventLocation,
          departmentId: eventDept,
          status: 'pending'
      };
      onSubmitEvent(newEvent);
      sendEmailNotification('Termin', eventTitle, 'Mitglied');
      setSubmitted(true);
  };

  if (submitted) {
      return (
          <div className="max-w-2xl mx-auto py-20 px-4 text-center animate-in zoom-in-95">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Vielen Dank!</h2>
              <p className="text-slate-600 mb-8 text-lg">
                  Der Antrag wurde erfolgreich übermittelt und eine E-Mail-Benachrichtigung wurde vorbereitet.<br/>
                  Sobald der Administrator den Eintrag prüft, wird er auf der Webseite sichtbar.
              </p>
              <button onClick={onBack} className="bg-club-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-club-700 transition-colors">
                  Zurück zur Startseite
              </button>
          </div>
      );
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Beitrag einreichen</h1>
            <p className="text-slate-600">
                Hier können Berichte oder Termine für die Webseite vorgeschlagen werden.
            </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start gap-3 text-blue-800 text-sm">
            <Info size={20} className="shrink-0 mt-0.5" />
            <div>
                <strong>Hinweis:</strong> Eingereichte Beiträge müssen erst durch einen Administrator freigegeben werden.
                <br />
                Für <strong>Löschungen oder Korrekturen</strong> an bestehenden Einträgen wenden Sie sich bitte direkt an den Administrator.
            </div>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-100">
                <button 
                    onClick={() => setActiveTab('post')}
                    className={`flex-1 py-4 text-center font-bold text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'post' ? 'bg-club-50 text-club-700 border-b-2 border-club-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    <FileText size={18} /> Bericht / News
                </button>
                <button 
                    onClick={() => setActiveTab('event')}
                    className={`flex-1 py-4 text-center font-bold text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'event' ? 'bg-club-50 text-club-700 border-b-2 border-club-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    <Calendar size={18} /> Termin / Event
                </button>
            </div>

            <div className="p-6 md:p-8">
                {activeTab === 'post' ? (
                    <form onSubmit={handleSubmitPost} className="space-y-6">
                         {/* Title */}
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Überschrift (Pflicht)</label>
                            <input 
                                required
                                className="w-full p-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-club-500 focus:outline-none" 
                                value={postTitle} 
                                onChange={e => setPostTitle(e.target.value)} 
                                placeholder="Titel des Beitrags" 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Abteilung</label>
                                <select 
                                    className="w-full p-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-club-500 focus:outline-none" 
                                    value={postDept} 
                                    onChange={e => setPostDept(e.target.value)}
                                >
                                    {DEPARTMENTS.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Datum</label>
                                <input 
                                    required
                                    type="date"
                                    className="w-full p-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-club-500 focus:outline-none" 
                                    value={postDate} 
                                    onChange={e => setPostDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ihr Name (Autor)</label>
                            <input 
                                required
                                className="w-full p-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-club-500 focus:outline-none" 
                                value={postAuthor} 
                                onChange={e => setPostAuthor(e.target.value)} 
                                placeholder="Max Mustermann" 
                            />
                        </div>

                        {/* Image */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Grafik (Optional)</label>
                            <div 
                                onClick={() => postImageInputRef.current?.click()}
                                className={`relative w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group ${postImage ? 'border-club-200 bg-slate-50 h-auto min-h-[200px]' : 'border-slate-300 hover:border-club-400 hover:bg-club-50 h-32'}`}
                            >
                                {postImage ? (
                                    <>
                                        <img src={postImage} alt="Preview" className="w-full h-auto object-contain p-2" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                                            Bild ändern
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-slate-400 group-hover:text-club-600">
                                        <ImageIcon size={24} className="mx-auto mb-2" />
                                        <span className="text-sm">Bild hochladen</span>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    ref={postImageInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Artikeltext</label>
                            <textarea 
                                required
                                className="w-full p-3 border border-slate-300 bg-white rounded-lg min-h-[200px] focus:ring-2 focus:ring-club-500 focus:outline-none"
                                value={postContent}
                                onChange={e => setPostContent(e.target.value)}
                                placeholder="Hier den Text eingeben..."
                            />
                        </div>

                        <button type="submit" className="w-full bg-club-600 text-white py-3.5 rounded-xl font-bold hover:bg-club-700 transition-colors flex items-center justify-center gap-2">
                            <Send size={18} /> Einreichen
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmitEvent} className="space-y-6">
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Titel des Termins</label>
                           <input 
                                required
                                className="w-full p-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-club-500 focus:outline-none" 
                                value={eventTitle} 
                                onChange={e => setEventTitle(e.target.value)} 
                                placeholder="z.B. Sommerfest" 
                           />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Datum</label>
                                <input 
                                    required
                                    type="date" 
                                    className="w-full p-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-club-500 focus:outline-none" 
                                    value={eventDate} 
                                    onChange={e => setEventDate(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Beginn</label>
                                <input 
                                    type="time" 
                                    required
                                    className="w-full p-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-club-500 focus:outline-none" 
                                    value={eventStart} 
                                    onChange={e => setEventStart(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ende (Optional)</label>
                                <input 
                                    type="time" 
                                    className="w-full p-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-club-500 focus:outline-none" 
                                    value={eventEnd} 
                                    onChange={e => setEventEnd(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ort</label>
                            <input 
                                required
                                className="w-full p-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-club-500 focus:outline-none" 
                                value={eventLocation} 
                                onChange={e => setEventLocation(e.target.value)} 
                                placeholder="Ort (z.B. Sportheim)" 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Abteilung</label>
                            <select 
                                className="w-full p-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-club-500 focus:outline-none" 
                                value={eventDept} 
                                onChange={e => setEventDept(e.target.value)}
                            >
                                {DEPARTMENTS.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="w-full bg-club-600 text-white py-3.5 rounded-xl font-bold hover:bg-club-700 transition-colors flex items-center justify-center gap-2">
                            <Send size={18} /> Einreichen
                        </button>
                    </form>
                )}
            </div>
        </div>
    </div>
  );
};

export default SubmissionView;