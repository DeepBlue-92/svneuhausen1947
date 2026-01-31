import React, { useState, useRef, useEffect } from 'react';
import { User, Post, CalendarEvent, GalleryImage, Partner } from '../types';
import { Users, FileText, Calendar, Plus, Trash2, Edit2, Save, X, Image as ImageIcon, Images, AlertTriangle, CheckCircle, Shield, ArrowUp, ArrowDown, Github, UploadCloud, Loader2, XCircle, Check, ClipboardCheck, Upload, AlertCircle, Handshake, File, Bold, Italic, Underline, List, ListOrdered, Type, Indent, Outdent } from 'lucide-react';
import { checkAccess, pushToGitHub, REPO_OWNER, REPO_NAME, BRANCH } from '../utils/github';

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  posts: Post[];
  events: CalendarEvent[];
  galleryImages: GalleryImage[];
  partners: Partner[];
  onUpdateUsers: (users: User[]) => void;
  onUpdatePosts: (posts: Post[]) => void;
  onUpdateEvents: (events: CalendarEvent[]) => void;
  onUpdateGallery: (images: GalleryImage[]) => void;
  onUpdatePartners: (partners: Partner[]) => void;
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

// --- HELPER DIALOGS ---
interface ToastProps { message: string; type: 'success' | 'error'; onClose: () => void; }
const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => (
    <div className={`fixed bottom-6 right-6 z-[200] px-6 py-4 rounded-xl shadow-lg border flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 ${type === 'success' ? 'bg-white border-green-200 text-green-800' : 'bg-white border-red-200 text-red-800'}`}>
        {type === 'success' ? <CheckCircle size={20} className="text-green-600" /> : <AlertTriangle size={20} className="text-red-600" />}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70"><X size={16}/></button>
    </div>
);

interface ConfirmDialogProps { message: string; onConfirm: () => void; onCancel: () => void; }
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel}></div>
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Bestätigung erforderlich</h3>
            <p className="text-slate-600 mb-6">{message}</p>
            <div className="flex justify-end gap-3">
                <button onClick={onCancel} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium">Abbrechen</button>
                <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 font-bold shadow-sm">Bestätigen</button>
            </div>
        </div>
    </div>
);

// --- ICAL HELPER TYPES ---
interface ImportCandidate extends CalendarEvent {
    isDuplicate: boolean;
    selected: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  currentUser, users, posts, events, galleryImages, partners,
  onUpdateUsers, onUpdatePosts, onUpdateEvents, onUpdateGallery, onUpdatePartners
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'events' | 'approvals' | 'gallery' | 'partners'>('posts');
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [confirmData, setConfirmData] = useState<{msg: string, action: () => void} | null>(null);
  const [githubToken, setGithubToken] = useState(currentUser.accessToken || '');
  const [tokenStatus, setTokenStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // New state for file uploads

  // Editors
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<CalendarEvent> | null>(null);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partial<Partner> | null>(null);
  
  // Gallery Import State
  const [pendingGalleryImages, setPendingGalleryImages] = useState<Partial<GalleryImage>[]>([]);
  const [hasGalleryChanges, setHasGalleryChanges] = useState(false);
  
  // Import State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importCandidates, setImportCandidates] = useState<ImportCandidate[]>([]);
  
  // Bulk Events State
  const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(new Set());
  const [bulkActionCategory, setBulkActionCategory] = useState<string>('all');
  
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const postImageInputRef = useRef<HTMLInputElement>(null);
  const postPdfInputRef = useRef<HTMLInputElement>(null);
  const eventPdfInputRef = useRef<HTMLInputElement>(null);
  const partnerImageInputRef = useRef<HTMLInputElement>(null); 
  const icalInputRef = useRef<HTMLInputElement>(null);
  
  // WYSIWYG Editor Ref
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync content to editor when opening a post
  useEffect(() => {
    if (editingPost && editorRef.current) {
        // Only update if the content is drastically different to prevent cursor jumps, 
        // or if we just opened the editor (no focus yet)
        if (editorRef.current.innerHTML !== editingPost.content) {
             editorRef.current.innerHTML = editingPost.content || '';
        }
    }
  }, [editingPost?.id]); // Only re-sync when switching posts, not on every keystroke

  // Calculate pending counts
  const pendingPosts = posts.filter(p => p.status === 'pending');
  const pendingEvents = events.filter(e => e.status === 'pending');
  const pendingCount = pendingPosts.length + pendingEvents.length;

  // --- HELPERS ---
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
      setNotification({ msg, type });
      setTimeout(() => setNotification(null), 4000);
  };

  const confirmAction = (msg: string, action: () => void) => setConfirmData({ msg, action });
  const getDepartmentName = (id: string) => DEPARTMENTS.find(d => d.id === id)?.name || id;

  // --- EDITOR TOOLBAR HELPER ---
  const applyFormat = (command: string, value?: string) => {
      document.execCommand(command, false, value);

      // Fix for list bullets color: Apply color to LI parent if present
      if (command === 'foreColor' && value) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            let node = selection.getRangeAt(0).commonAncestorContainer;
            if (node.nodeType === 3) node = node.parentNode!; // Text node -> Element
            
            let el = node as HTMLElement;
            // Walk up to find LI
            while (el && el.nodeName !== 'LI' && el.nodeName !== 'DIV' && el.contentEditable !== 'true') {
                el = el.parentElement as HTMLElement;
            }
            // If we found an LI, color it. The marker (bullet) inherits this color.
            if (el && el.nodeName === 'LI') {
                el.style.color = value;
            }
        }
      }

      // Sync state immediately so buttons work
      if (editorRef.current && editingPost) {
          setEditingPost({ ...editingPost, content: editorRef.current.innerHTML });
      }
      editorRef.current?.focus();
  };

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
      if (editingPost) {
          setEditingPost({ ...editingPost, content: e.currentTarget.innerHTML });
      }
  };

  // --- GITHUB SYNC ---
  const handleTokenChange = (token: string) => {
      setGithubToken(token);
      setTokenStatus('idle'); // Reset status on type
      currentUser.accessToken = token;
  };

  const verifyToken = async () => {
      if (!githubToken) {
          setTokenStatus('idle');
          return;
      }
      setTokenStatus('validating');
      try {
          const res = await fetch('https://api.github.com/user', {
              headers: {
                  Authorization: `Bearer ${githubToken}`,
                  Accept: "application/vnd.github.v3+json"
              }
          });
          if (res.ok) {
              setTokenStatus('valid');
          } else {
              setTokenStatus('invalid');
          }
      } catch (e) {
          setTokenStatus('invalid');
      }
  };

  // Check token initially if present
  useEffect(() => {
      if (githubToken && tokenStatus === 'idle') {
          verifyToken();
      }
  }, []);

  const syncDataToGitHub = async (filename: string, data: any, folder: string = 'public/data') => {
      if (!githubToken) return { success: false, message: 'GitHub Token fehlt' };
      const userWithToken = { ...currentUser, accessToken: githubToken };
      const res = await pushToGitHub(userWithToken, `${folder}/${filename}`, JSON.stringify(data, null, 2), `Update ${filename}`);
      return res;
  };

  // --- GALLERY HELPER ---
  const moveGalleryImage = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === galleryImages.length - 1) return;

      const newImages = [...galleryImages];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      
      onUpdateGallery(newImages);
      setHasGalleryChanges(true);
  };

  const handleGalleryTitleChange = (id: string, newTitle: string) => {
      const updatedGallery = galleryImages.map(img => img.id === id ? { ...img, title: newTitle } : img);
      onUpdateGallery(updatedGallery);
      setHasGalleryChanges(true);
  };

  const handlePersistGallery = async () => {
      if (!githubToken) {
          showToast("Fehler: GitHub Token fehlt.", "error");
          return;
      }
      setIsSaving(true);
      const syncRes = await syncDataToGitHub('gallery.json', galleryImages);
      setIsSaving(false);
      
      if(syncRes.success) {
          setHasGalleryChanges(false);
          showToast("Galerie-Änderungen gespeichert.", "success");
      } else {
          showToast("Fehler beim Speichern: " + syncRes.message, "error");
      }
  };

  // --- BULK ACTION HELPER ---
  const toggleEventSelection = (id: string) => {
      const newSet = new Set(selectedEventIds);
      if (newSet.has(id)) {
          newSet.delete(id);
      } else {
          newSet.add(id);
      }
      setSelectedEventIds(newSet);
  };

  const handleBulkUpdate = async () => {
       if (!githubToken) {
          showToast("Fehler: GitHub Token fehlt.", "error");
          return;
      }
      if (selectedEventIds.size === 0) return;

      setIsSaving(true);
      
      const updatedEvents = events.map(e => {
          if (selectedEventIds.has(e.id)) {
              return { ...e, departmentId: bulkActionCategory };
          }
          return e;
      });

      onUpdateEvents(updatedEvents);
      const syncRes = await syncDataToGitHub('events.json', updatedEvents);
      
      setIsSaving(false);
      
      if(syncRes.success) {
          showToast(`${selectedEventIds.size} Termine aktualisiert.`, "success");
          setSelectedEventIds(new Set());
      } else {
          showToast("Fehler beim Upload: " + syncRes.message, "error");
      }
  };

  // --- ICAL PARSER & IMPORT ---
  const handleIcalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (event) => {
              const text = event.target?.result as string;
              parseIcalData(text);
          };
          reader.readAsText(file);
      }
      e.target.value = '';
  };

  const parseIcalData = (icalText: string) => {
    // Very basic iCal parser
    const lines = icalText.split(/\r\n|\n|\r/);
    const newEvents: ImportCandidate[] = [];
    let currentEvent: any = {};
    let inEvent = false;

    const parseDate = (icalDate: string) => {
        if (!icalDate) return { date: '', time: '' };
        
        const year = icalDate.substring(0, 4);
        const month = icalDate.substring(4, 6);
        const day = icalDate.substring(6, 8);
        
        let hour = '00';
        let minute = '00';
        
        if (icalDate.includes('T')) {
            const timePart = icalDate.split('T')[1];
            hour = timePart.substring(0, 2);
            minute = timePart.substring(2, 4);
        }

        return {
            date: `${year}-${month}-${day}`, // YYYY-MM-DD
            time: `${hour}:${minute}` // HH:mm
        };
    };

    for (const line of lines) {
        if (line.startsWith('BEGIN:VEVENT')) {
            inEvent = true;
            currentEvent = {};
        } else if (line.startsWith('END:VEVENT')) {
            inEvent = false;
            if (currentEvent.SUMMARY && currentEvent.DTSTART) {
                const start = parseDate(currentEvent.DTSTART);
                let end = { time: '' };
                if (currentEvent.DTEND) {
                    end = parseDate(currentEvent.DTEND);
                }

                const isDup = events.some(e => 
                    e.title === currentEvent.SUMMARY && 
                    e.startDate === start.date && 
                    e.startTime === start.time
                );

                newEvents.push({
                    id: Date.now().toString() + Math.random().toString().slice(2,6),
                    title: currentEvent.SUMMARY,
                    startDate: start.date,
                    startTime: start.time,
                    endTime: end.time || undefined,
                    location: currentEvent.LOCATION || 'Sportgelände',
                    departmentId: currentUser.role === 'head' ? (currentUser.departmentId || 'all') : 'all',
                    status: 'approved',
                    isDuplicate: isDup,
                    selected: !isDup
                });
            }
        } else if (inEvent) {
            if (line.startsWith('SUMMARY:')) currentEvent.SUMMARY = line.substring(8);
            if (line.startsWith('DTSTART')) {
                 const parts = line.split(':');
                 currentEvent.DTSTART = parts[parts.length - 1];
            }
            if (line.startsWith('DTEND')) {
                 const parts = line.split(':');
                 currentEvent.DTEND = parts[parts.length - 1];
            }
            if (line.startsWith('LOCATION:')) currentEvent.LOCATION = line.substring(9);
        }
    }

    setImportCandidates(newEvents);
    setShowImportModal(true);
  };

  const handleFinishImport = async () => {
      const toImport = importCandidates.filter(c => c.selected).map(({ isDuplicate, selected, ...event }) => event);
      if (toImport.length === 0) {
          setShowImportModal(false);
          return;
      }

      if (!githubToken) {
          showToast("Fehler: GitHub Token fehlt. Import nicht möglich.", "error");
          return;
      }

      setIsSaving(true);
      const updatedEvents = [...events, ...toImport].sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      
      onUpdateEvents(updatedEvents);
      const syncRes = await syncDataToGitHub('events.json', updatedEvents);
      
      setIsSaving(false);
      setShowImportModal(false);
      
      if(syncRes.success) {
          showToast(`${toImport.length} Termine importiert.`, "success");
      } else {
          showToast("Fehler beim Upload: " + syncRes.message, "error");
      }
  };

  // --- DELETE HANDLERS ---
  const handleDeletePost = async (postId: string) => {
    if (!githubToken) {
        showToast("Fehler: GitHub Token fehlt.", "error");
        return;
    }
    const updatedPosts = posts.filter(p => p.id !== postId);
    onUpdatePosts(updatedPosts); 
    const syncRes = await syncDataToGitHub('posts.json', updatedPosts);
    if(syncRes.success) showToast("Beitrag erfolgreich gelöscht.", "success");
    else showToast("Fehler beim Löschen: " + syncRes.message, "error");
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!githubToken) {
        showToast("Fehler: GitHub Token fehlt.", "error");
        return;
    }
    const updatedEvents = events.filter(e => e.id !== eventId);
    onUpdateEvents(updatedEvents);
    const syncRes = await syncDataToGitHub('events.json', updatedEvents);
    if(syncRes.success) showToast("Termin erfolgreich gelöscht.", "success");
    else showToast("Fehler beim Löschen: " + syncRes.message, "error");
  };

  const handleDeleteGalleryImage = async (imageId: string) => {
    if (!githubToken) {
        showToast("Fehler: GitHub Token fehlt.", "error");
        return;
    }
    const updatedGallery = galleryImages.filter(g => g.id !== imageId);
    onUpdateGallery(updatedGallery);
    const syncRes = await syncDataToGitHub('gallery.json', updatedGallery);
    if(syncRes.success) showToast("Bild erfolgreich gelöscht.", "success");
    else showToast("Fehler beim Löschen: " + syncRes.message, "error");
  };

  const handleDeletePartner = async (partnerId: string) => {
    if (!githubToken) {
        showToast("Fehler: GitHub Token fehlt.", "error");
        return;
    }
    const updatedPartners = partners.filter(p => p.id !== partnerId);
    onUpdatePartners(updatedPartners);
    const syncRes = await syncDataToGitHub('sponsoren.json', updatedPartners, 'data');
    if (syncRes.success) showToast("Partner erfolgreich gelöscht.", "success");
    else showToast("Fehler beim Löschen: " + syncRes.message, "error");
  };

  // --- USER MANAGEMENT ---
  const handleSaveUser = () => {
    if (!editingUser?.username || !editingUser.password || !editingUser.displayName) {
        showToast("Bitte alle Pflichtfelder ausfüllen.", "error");
        return;
    }
    if (currentUser.role !== 'admin') {
        showToast("Nur Administratoren können Benutzer verwalten.", "error");
        return;
    }
    const newUser: User = {
        id: editingUser.id || Date.now().toString(),
        username: editingUser.username,
        password: editingUser.password,
        displayName: editingUser.displayName,
        role: editingUser.role || 'head',
        departmentId: editingUser.role === 'admin' ? undefined : (editingUser.departmentId || 'fussball')
    };
    const updatedUsers = editingUser.id ? users.map(u => u.id === newUser.id ? newUser : u) : [...users, newUser];
    onUpdateUsers(updatedUsers);
    setEditingUser(null);
    showToast("Benutzer gespeichert (Lokal).", "success");
  };

  const handleDeleteUser = (id: string) => {
      if (id === currentUser.id) {
          showToast("Sie können sich nicht selbst löschen.", "error");
          return;
      }
      onUpdateUsers(users.filter(u => u.id !== id));
      showToast("Benutzer gelöscht.", "success");
  };

  // --- APPROVALS ---
  const handleApprovePost = async (post: Post) => {
      if (!githubToken) {
          showToast("Fehler: GitHub Token fehlt.", "error");
          return;
      }
      const updatedPost = { ...post, status: 'approved' as const };
      const updatedPosts = posts.map(p => p.id === post.id ? updatedPost : p);
      onUpdatePosts(updatedPosts);
      const syncRes = await syncDataToGitHub('posts.json', updatedPosts);
      if (syncRes.success) showToast('Beitrag genehmigt.', 'success');
      else showToast('Genehmigung fehlgeschlagen: ' + syncRes.message, 'error');
  };

  const handleApproveEvent = async (event: CalendarEvent) => {
      if (!githubToken) {
          showToast("Fehler: GitHub Token fehlt.", "error");
          return;
      }
      const updatedEvent = { ...event, status: 'approved' as const };
      const updatedEvents = events.map(e => e.id === event.id ? updatedEvent : e);
      onUpdateEvents(updatedEvents);
      const syncRes = await syncDataToGitHub('events.json', updatedEvents);
      if (syncRes.success) showToast('Termin genehmigt.', 'success');
      else showToast('Genehmigung fehlgeschlagen: ' + syncRes.message, 'error');
  };

  // --- POSTS ---
  const handleEditPost = (post: Post) => {
      // Content is now HTML safe
      setEditingPost({
          ...post,
          content: post.content,
          date: new Date(post.date).toISOString().slice(0, 10),
          author: post.author || currentUser.displayName
      });
  };

  const handleNewPost = () => {
      setEditingPost({ 
        departmentId: currentUser.role === 'head' ? currentUser.departmentId : 'all',
        content: '', 
        title: '',
        imageUrl: '',
        pdfUrl: '',
        date: new Date().toISOString().slice(0, 10),
        author: currentUser.displayName,
        status: 'approved'
    });
  };

  const handleSavePost = async () => {
    if (!githubToken) {
        showToast("Fehler: GitHub Token fehlt.", "error");
        return;
    }
    if (!editingPost?.title) { showToast("Überschrift ist ein Pflichtfeld.", "error"); return; }
    if (!editingPost?.content) { showToast("Artikeltext ist ein Pflichtfeld.", "error"); return; }
    if (!editingPost?.date) { showToast("Datum ist ein Pflichtfeld.", "error"); return; }
    if (!editingPost?.author) { showToast("Autor ist ein Pflichtfeld.", "error"); return; }
    
    const targetDept = editingPost.departmentId || 'all';
    
    if (!checkAccess(currentUser, targetDept)) {
        showToast(`Keine Berechtigung für Abteilung: ${getDepartmentName(targetDept)}`, "error");
        return;
    }

    setIsSaving(true);

    const newPost: Post = {
      id: editingPost.id || Date.now().toString(),
      title: editingPost.title,
      content: editingPost.content || '', // Content is already HTML from WYSIWYG
      imageUrl: editingPost.imageUrl,
      pdfUrl: editingPost.pdfUrl,
      date: new Date(editingPost.date).toISOString(),
      departmentId: targetDept,
      authorId: currentUser.id,
      author: editingPost.author,
      status: 'approved'
    };

    const updatedPosts = editingPost.id 
        ? posts.map(p => p.id === newPost.id ? newPost : p)
        : [newPost, ...posts];

    onUpdatePosts(updatedPosts);
    const syncRes = await syncDataToGitHub('posts.json', updatedPosts);
    
    setIsSaving(false);
    
    if(syncRes.success) {
        setEditingPost(null);
        showToast("Beitrag gespeichert & synchronisiert.", "success");
    } else {
        showToast("Fehler beim Upload: " + syncRes.message, "error");
    }
  };

  // --- EVENTS ---
  const handleSaveEvent = async () => {
    if (!githubToken) {
        showToast("Fehler: GitHub Token fehlt.", "error");
        return;
    }
    if (!editingEvent?.title || !editingEvent.startDate) {
        showToast("Titel und Datum sind Pflichtfelder.", "error");
        return;
    }
    const targetDept = editingEvent.departmentId || 'all';
    if (!checkAccess(currentUser, targetDept)) {
        showToast("Keine Berechtigung für diese Abteilung.", "error");
        return;
    }

    setIsSaving(true);

    const eventId = editingEvent.id || Date.now().toString();
    const newEvent: CalendarEvent = {
        id: eventId,
        title: editingEvent.title,
        startDate: editingEvent.startDate,
        startTime: editingEvent.startTime || '12:00',
        endTime: editingEvent.endTime,
        location: editingEvent.location || 'Sportgelände',
        departmentId: targetDept,
        pdfUrl: editingEvent.pdfUrl,
        status: 'approved'
    };

    const updatedEvents = editingEvent.id 
        ? events.map(e => e.id === newEvent.id ? newEvent : e)
        : [...events, newEvent].sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    onUpdateEvents(updatedEvents);
    const syncRes = await syncDataToGitHub('events.json', updatedEvents);
    
    setIsSaving(false);
    
    if(syncRes.success) {
        setEditingEvent(null);
        showToast("Termin gespeichert & synchronisiert.", "success");
    } else {
        showToast("Fehler beim Upload: " + syncRes.message, "error");
    }
  };

  // --- PARTNERS ---
  const handleCreatePartner = () => {
      setEditingPartner({
          id: Date.now().toString() + Math.random().toString().slice(2,8),
          name: '',
          imageUrl: '',
          placeholderColor: 'bg-slate-100 text-slate-500'
      });
  };

  const handleSaveEditedPartner = async () => {
    if (!githubToken) {
        showToast("Fehler: GitHub Token fehlt.", "error");
        return;
    }
    if (!editingPartner?.name) {
        showToast("Name des Partners ist ein Pflichtfeld.", "error");
        return;
    }

    setIsSaving(true);

    const newPartner: Partner = {
        id: editingPartner.id || Date.now().toString(),
        name: editingPartner.name,
        description: '',
        imageUrl: editingPartner.imageUrl,
        placeholderColor: editingPartner.placeholderColor
    };

    const exists = partners.some(p => p.id === newPartner.id);
    const updatedPartners = exists 
        ? partners.map(p => p.id === newPartner.id ? newPartner : p) 
        : [...partners, newPartner];

    onUpdatePartners(updatedPartners);
    const syncRes = await syncDataToGitHub('sponsoren.json', updatedPartners, 'data');
    
    setIsSaving(false);
    
    if(syncRes.success) {
        setEditingPartner(null);
        showToast("Partner gespeichert & synchronisiert.", "success");
    } else {
        showToast("Fehler beim Upload: " + syncRes.message, "error");
    }
  };

  // --- GALLERY ---
  const handleGalleryFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const files = Array.from(e.target.files) as File[];
          const promises = files.map(file => new Promise<Partial<GalleryImage>>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                  resolve({
                      id: Date.now().toString() + Math.random().toString().slice(2,5),
                      title: '',
                      imageUrl: reader.result as string,
                      departmentId: 'tennis'
                  });
              };
              reader.readAsDataURL(file);
          }));

          Promise.all(promises).then(newItems => {
              setPendingGalleryImages(prev => [...prev, ...newItems]);
          });
      }
      e.target.value = '';
  };

  const handleSaveGalleryImages = async () => {
      if (!githubToken) {
          showToast("Fehler: GitHub Token fehlt.", "error");
          return;
      }
      if (pendingGalleryImages.length === 0) return;
      if (!checkAccess(currentUser, 'tennis')) {
          showToast("Nur die Tennis-Abteilung hat eine Galerie.", "error");
          return;
      }
      
      setIsSaving(true);

      const newImages = pendingGalleryImages.map(img => ({
          id: img.id || Date.now().toString(),
          title: img.title || 'Ohne Titel',
          imageUrl: img.imageUrl!,
          departmentId: 'tennis'
      }));

      const updatedGallery = [...galleryImages, ...newImages];
      onUpdateGallery(updatedGallery);
      const syncRes = await syncDataToGitHub('gallery.json', updatedGallery);
      
      setIsSaving(false);
      
      if(syncRes.success) {
          setPendingGalleryImages([]);
          showToast(`${newImages.length} Bilder hochgeladen.`, "success");
      } else {
          showToast("Fehler beim Upload: " + syncRes.message, "error");
      }
  };

  // --- FILE UPLOAD HANDLERS ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setter((prev: any) => ({ ...prev, imageUrl: reader.result as string }));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // CHANGED: Modified to upload PDF immediately to 'public/downloads/'
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
    if (!githubToken) {
        showToast("Fehler: GitHub Token fehlt. Upload nicht möglich.", "error");
        if (e.target) e.target.value = '';
        return;
    }

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
          showToast("Bitte nur PDF-Dateien hochladen.", "error");
          return;
      }

      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onloadend = async () => {
          const base64Content = reader.result as string;
          // Clean filename
          const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const fileName = `doc_${Date.now()}_${safeName}`;
          const path = `public/downloads/${fileName}`;

          try {
              const res = await pushToGitHub(currentUser, path, base64Content, `Upload PDF ${fileName}`, true);
              if (res.success) {
                  // Construct the raw URL
                  const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${path}`;
                  setter((prev: any) => ({ ...prev, pdfUrl: url }));
                  showToast("PDF erfolgreich hochgeladen und verknüpft.", "success");
              } else {
                  showToast("Fehler beim PDF Upload: " + res.message, "error");
              }
          } catch (err: any) {
              showToast("Fehler beim PDF Upload.", "error");
          } finally {
              setIsUploading(false);
          }
      };
      
      reader.readAsDataURL(file);
    }
  };

  // --- RENDER ---
  return (
    <>
    <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden min-h-[600px] flex flex-col md:flex-row relative">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-2">
        <div className="mb-6">
            <h2 className="font-bold text-slate-900">Dashboard</h2>
            <div className="flex items-center gap-2 mt-1">
                <div className="w-8 h-8 rounded-full bg-club-100 text-club-700 flex items-center justify-center font-bold text-xs">
                    {currentUser.username.substring(0,2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-700 truncate">{currentUser.displayName}</p>
                    <p className="text-[10px] text-slate-500 truncate">
                        {currentUser.role === 'admin' ? 'Administrator' : `Leitung ${getDepartmentName(currentUser.departmentId || '')}`}
                    </p>
                </div>
            </div>
        </div>

        <div className="mb-6 bg-white p-3 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                <Github size={10} /> GitHub Token (Pflicht für Upload)
            </label>
            <div className="relative">
                <input 
                    type="password" 
                    value={githubToken} 
                    onChange={(e) => handleTokenChange(e.target.value)}
                    onBlur={verifyToken}
                    className={`w-full text-xs p-2 pr-8 rounded bg-slate-50 border focus:outline-none transition-colors ${
                        tokenStatus === 'valid' ? 'border-green-300 focus:border-green-500 bg-green-50' :
                        tokenStatus === 'invalid' ? 'border-red-300 focus:border-red-500 bg-red-50' :
                        'border-slate-200 focus:border-club-500'
                    }`}
                    placeholder="ghp_..."
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {tokenStatus === 'validating' && <Loader2 size={12} className="animate-spin text-slate-400" />}
                    {tokenStatus === 'valid' && <Check size={12} className="text-green-600" />}
                    {tokenStatus === 'invalid' && <XCircle size={12} className="text-red-500" />}
                </div>
            </div>
            {tokenStatus === 'valid' && <div className="text-[9px] text-green-600 mt-1 font-medium">Verbindung hergestellt</div>}
            {tokenStatus === 'invalid' && <div className="text-[9px] text-red-500 mt-1 font-medium">Token ungültig</div>}
        </div>

        <button onClick={() => { setActiveTab('posts'); setEditingPost(null); }} className={`text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors ${activeTab === 'posts' ? 'bg-club-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}><FileText size={18} /> Beiträge</button>
        <button onClick={() => { setActiveTab('events'); setEditingEvent(null); setSelectedEventIds(new Set()); }} className={`text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors ${activeTab === 'events' ? 'bg-club-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}><Calendar size={18} /> Termine</button>
        <button onClick={() => { setActiveTab('approvals'); }} className={`text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors relative ${activeTab === 'approvals' ? 'bg-club-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}><ClipboardCheck size={18} /> Anträge {pendingCount > 0 && (<span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] rounded-full font-bold">{pendingCount}</span>)}</button>
        {checkAccess(currentUser, 'tennis') && (<button onClick={() => { setActiveTab('gallery'); setPendingGalleryImages([]); setHasGalleryChanges(false); }} className={`text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors ${activeTab === 'gallery' ? 'bg-club-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}><Images size={18} /> Galerie</button>)}
        {currentUser.role === 'admin' && (
            <>
                <div className="h-px bg-slate-200 my-2 mx-4"></div>
                <button onClick={() => { setActiveTab('partners'); setEditingPartner(null); }} className={`text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors ${activeTab === 'partners' ? 'bg-club-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}><Handshake size={18} /> Sponsoren</button>
                <button onClick={() => { setActiveTab('users'); setEditingUser(null); }} className={`text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors ${activeTab === 'users' ? 'bg-club-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}><Users size={18} /> Benutzer</button>
            </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
        
        {/* APPROVALS TAB */}
        {activeTab === 'approvals' && (
            <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Ausstehende Anträge</h3>
                {pendingCount === 0 ? (
                    <div className="text-center py-20 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <CheckCircle size={48} className="mx-auto mb-3 opacity-50" />
                        <p>Keine offenen Anträge vorhanden.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {pendingPosts.length > 0 && (
                            <div>
                                <h4 className="font-bold text-slate-700 uppercase text-xs mb-3 flex items-center gap-2">
                                    <FileText size={14} /> Beiträge ({pendingPosts.length})
                                </h4>
                                <div className="space-y-3">
                                    {pendingPosts.map(post => (
                                        <div key={post.id} className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                                            <div className="flex justify-between items-start pl-3">
                                                <div>
                                                    <h5 className="font-bold text-slate-900">{post.title}</h5>
                                                    <p className="text-xs text-slate-500 mb-2">Von: {post.author} • {new Date(post.date).toLocaleDateString()} • {getDepartmentName(post.departmentId)}</p>
                                                    <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg line-clamp-2"><span dangerouslySetInnerHTML={{__html: post.content}}></span></div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEditPost(post)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleApprovePost(post)} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"><Check size={16} /></button>
                                                    <button onClick={() => confirmAction('Antrag wirklich ablehnen und löschen?', () => handleDeletePost(post.id))} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"><X size={16} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {pendingEvents.length > 0 && (
                            <div>
                                <h4 className="font-bold text-slate-700 uppercase text-xs mb-3 flex items-center gap-2">
                                    <Calendar size={14} /> Termine ({pendingEvents.length})
                                </h4>
                                <div className="space-y-3">
                                    {pendingEvents.map(event => (
                                        <div key={event.id} className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                                            <div className="flex justify-between items-start pl-3">
                                                <div>
                                                    <h5 className="font-bold text-slate-900">{event.title}</h5>
                                                    <p className="text-xs text-slate-500 mb-2">{new Date(event.startDate).toLocaleDateString()} {event.startTime} • {event.location}</p>
                                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded">{getDepartmentName(event.departmentId)}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setEditingEvent(event)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleApproveEvent(event)} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"><Check size={16} /></button>
                                                    <button onClick={() => confirmAction('Antrag wirklich ablehnen und löschen?', () => handleDeleteEvent(event.id))} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"><X size={16} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )}

        {/* POSTS TAB */}
        {activeTab === 'posts' && (
            <div>
                {!editingPost ? (
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-slate-900">Beiträge verwalten</h3>
                        <button onClick={handleNewPost} className="bg-club-600 hover:bg-club-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"><Plus size={16} /> Neuer Beitrag</button>
                    </div>
                ) : (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
                        <h4 className="font-bold mb-4">{editingPost.id ? 'Beitrag bearbeiten' : 'Neuen Beitrag erstellen'}</h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Titel</label><input className="w-full p-2 rounded-lg border border-slate-300 bg-white" value={editingPost.title} onChange={e => setEditingPost({...editingPost, title: e.target.value})} placeholder="Überschrift" /></div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Abteilung</label><select className="w-full p-2 rounded-lg border border-slate-300 bg-white" value={editingPost.departmentId} onChange={e => setEditingPost({...editingPost, departmentId: e.target.value})}>{DEPARTMENTS.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}</select></div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Datum</label><input className="w-full p-2 rounded-lg border border-slate-300 bg-white" type="date" value={editingPost.date} onChange={e => setEditingPost({...editingPost, date: e.target.value})} /></div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Autor</label><input className="w-full p-2 rounded-lg border border-slate-300 bg-white" value={editingPost.author} onChange={e => setEditingPost({...editingPost, author: e.target.value})} /></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Artikelbild (Optional)</label>
                                    <div onClick={() => postImageInputRef.current?.click()} className={`relative w-full h-24 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden ${editingPost.imageUrl ? 'border-club-200 bg-slate-50' : 'border-slate-300 hover:border-club-400 bg-white'}`}>
                                        {editingPost.imageUrl ? <img src={editingPost.imageUrl} className="h-full object-contain" alt="Preview"/> : <div className="flex flex-col items-center text-slate-400"><ImageIcon size={20}/><span className="text-[10px]">Bild wählen</span></div>}
                                    </div>
                                    <input type="file" ref={postImageInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setEditingPost)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">PDF Anhang (Optional)</label>
                                    <div onClick={() => postPdfInputRef.current?.click()} className={`relative w-full h-24 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden ${editingPost.pdfUrl ? 'border-red-200 bg-red-50' : 'border-slate-300 hover:border-red-400 bg-white'}`}>
                                        {isUploading ? (
                                            <div className="flex flex-col items-center text-slate-500">
                                                <Loader2 size={24} className="animate-spin" />
                                                <span className="text-[10px] mt-1">Lade hoch...</span>
                                            </div>
                                        ) : editingPost.pdfUrl ? (
                                            <div className="flex flex-col items-center text-red-600">
                                                <FileText size={24} />
                                                <span className="text-[10px] font-bold mt-1">PDF verknüpft</span>
                                                <span className="text-[9px] text-red-400">Klicken zum Ändern</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-400">
                                                <File size={20}/>
                                                <span className="text-[10px]">PDF wählen</span>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={postPdfInputRef} className="hidden" accept="application/pdf" onChange={(e) => handlePdfUpload(e, setEditingPost)} disabled={isUploading} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Inhalt (Visueller Editor)</label>
                                {/* RICH TEXT TOOLBAR */}
                                <div className="flex items-center gap-1 mb-2 p-1 bg-slate-100 rounded-lg border border-slate-200 w-fit">
                                    <button onMouseDown={(e) => { e.preventDefault(); applyFormat('bold'); }} className="p-1.5 hover:bg-white hover:text-club-600 rounded text-slate-600 transition-colors" title="Fett"><Bold size={16}/></button>
                                    <button onMouseDown={(e) => { e.preventDefault(); applyFormat('italic'); }} className="p-1.5 hover:bg-white hover:text-club-600 rounded text-slate-600 transition-colors" title="Kursiv"><Italic size={16}/></button>
                                    <button onMouseDown={(e) => { e.preventDefault(); applyFormat('underline'); }} className="p-1.5 hover:bg-white hover:text-club-600 rounded text-slate-600 transition-colors" title="Unterstrichen"><Underline size={16}/></button>
                                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                                    <button onMouseDown={(e) => { e.preventDefault(); applyFormat('insertUnorderedList'); }} className="p-1.5 hover:bg-white hover:text-club-600 rounded text-slate-600 transition-colors" title="Liste (Punkte)"><List size={16}/></button>
                                    <button onMouseDown={(e) => { e.preventDefault(); applyFormat('insertOrderedList'); }} className="p-1.5 hover:bg-white hover:text-club-600 rounded text-slate-600 transition-colors" title="Liste (Nummern)"><ListOrdered size={16}/></button>
                                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                                    <button onMouseDown={(e) => { e.preventDefault(); applyFormat('indent'); }} className="p-1.5 hover:bg-white hover:text-club-600 rounded text-slate-600 transition-colors" title="Einrücken"><Indent size={16}/></button>
                                    <button onMouseDown={(e) => { e.preventDefault(); applyFormat('outdent'); }} className="p-1.5 hover:bg-white hover:text-club-600 rounded text-slate-600 transition-colors" title="Ausrücken"><Outdent size={16}/></button>
                                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                                    <button onMouseDown={(e) => { e.preventDefault(); applyFormat('foreColor', '#E2231A'); }} className="p-1.5 hover:bg-white hover:text-red-600 rounded text-slate-600 transition-colors" title="Text Rot"><Type size={16} color="#E2231A"/></button>
                                    <button onMouseDown={(e) => { e.preventDefault(); applyFormat('foreColor', '#006747'); }} className="p-1.5 hover:bg-white hover:text-club-600 rounded text-slate-600 transition-colors" title="Text Grün"><Type size={16} color="#006747"/></button>
                                    <button onMouseDown={(e) => { e.preventDefault(); applyFormat('foreColor', '#0f172a'); }} className="p-1.5 hover:bg-white hover:text-slate-900 rounded text-slate-600 transition-colors" title="Standardfarbe (Schwarz/Dunkelgrau)"><Type size={16} color="#0f172a"/></button>
                                </div>
                                
                                {/* WYSIWYG Editor Area */}
                                <div 
                                    ref={editorRef}
                                    contentEditable
                                    onInput={handleEditorInput}
                                    className="w-full p-4 rounded-lg border border-slate-300 bg-white min-h-[300px] focus:outline-none focus:border-club-500 focus:ring-1 focus:ring-club-500/20 prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li::marker]:text-[inherit]"
                                    suppressContentEditableWarning={true}
                                />
                                <p className="text-[10px] text-slate-400 mt-1 text-right">Tipp: Kopieren Sie Text aus Word/Docs um Formatierungen zu übernehmen.</p>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                                <button onClick={() => setEditingPost(null)} className="px-4 py-2 text-slate-500 hover:bg-slate-200 rounded-lg">Abbrechen</button>
                                <button onClick={handleSavePost} disabled={isSaving || isUploading} className="px-4 py-2 bg-club-600 text-white rounded-lg font-bold disabled:opacity-50 flex items-center gap-2">{isSaving ? 'Speichert...' : 'Speichern'}{githubToken && <UploadCloud size={16}/>}</button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Post List */}
                {!editingPost && (
                    <div className="space-y-3">
                        {posts.filter(p => p.status === 'approved' || p.status === undefined).map(post => (
                            <div key={post.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-sm">
                                <div className="min-w-0">
                                    <div className="font-bold text-slate-900 truncate">{post.title}</div>
                                    <div className="text-xs text-slate-500">{new Date(post.date).toLocaleDateString()} • {getDepartmentName(post.departmentId)}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEditPost(post)} className="p-2 text-slate-400 hover:text-club-600 rounded-lg"><Edit2 size={16}/></button>
                                    <button onClick={() => confirmAction(`Beitrag "${post.title}" löschen?`, () => handleDeletePost(post.id))} className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
            <div>
                {!editingEvent ? (
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-slate-900">Termine verwalten</h3>
                        <div className="flex gap-2">
                            <div className="relative group">
                                <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"><Upload size={16} /> Import</button>
                                <input type="file" ref={icalInputRef} accept=".ics" onChange={handleIcalFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="iCal (.ics) Datei importieren" />
                            </div>
                            <button onClick={() => setEditingEvent({ departmentId: 'all', startDate: new Date().toISOString().slice(0, 10) })} className="bg-club-600 hover:bg-club-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"><Plus size={16} /> Neuer Termin</button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
                        <h4 className="font-bold mb-4">{editingEvent.id ? 'Termin bearbeiten' : 'Neuen Termin anlegen'}</h4>
                        <div className="space-y-4">
                            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Titel</label><input className="w-full p-2 rounded-lg border border-slate-300 bg-white" value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Datum</label><input className="w-full p-2 rounded-lg border border-slate-300 bg-white" type="date" value={editingEvent.startDate} onChange={e => setEditingEvent({...editingEvent, startDate: e.target.value})} /></div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Abteilung</label><select className="w-full p-2 rounded-lg border border-slate-300 bg-white" value={editingEvent.departmentId} onChange={e => setEditingEvent({...editingEvent, departmentId: e.target.value})}>{DEPARTMENTS.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}</select></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Beginn</label><input className="w-full p-2 rounded-lg border border-slate-300 bg-white" type="time" value={editingEvent.startTime} onChange={e => setEditingEvent({...editingEvent, startTime: e.target.value})} /></div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ende (Optional)</label><input className="w-full p-2 rounded-lg border border-slate-300 bg-white" type="time" value={editingEvent.endTime || ''} onChange={e => setEditingEvent({...editingEvent, endTime: e.target.value})} /></div>
                            </div>
                            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ort</label><input className="w-full p-2 rounded-lg border border-slate-300 bg-white" value={editingEvent.location} onChange={e => setEditingEvent({...editingEvent, location: e.target.value})} /></div>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">PDF Anhang (Optional)</label>
                                <div onClick={() => eventPdfInputRef.current?.click()} className={`relative w-full h-20 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden ${editingEvent.pdfUrl ? 'border-red-200 bg-red-50' : 'border-slate-300 hover:border-red-400 bg-white'}`}>
                                    {isUploading ? (
                                        <div className="flex flex-col items-center text-slate-500">
                                            <Loader2 size={20} className="animate-spin" />
                                            <span className="text-[10px] mt-1">Lade hoch...</span>
                                        </div>
                                    ) : editingEvent.pdfUrl ? (
                                        <div className="flex flex-col items-center text-red-600">
                                            <FileText size={20} />
                                            <span className="text-[10px] font-bold mt-1">PDF verknüpft</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-400">
                                            <File size={18}/>
                                            <span className="text-[10px]">PDF wählen</span>
                                        </div>
                                    )}
                                </div>
                                <input type="file" ref={eventPdfInputRef} className="hidden" accept="application/pdf" onChange={(e) => handlePdfUpload(e, setEditingEvent)} disabled={isUploading} />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                                <button onClick={() => setEditingEvent(null)} className="px-4 py-2 text-slate-500 hover:bg-slate-200 rounded-lg">Abbrechen</button>
                                <button onClick={handleSaveEvent} disabled={isSaving || isUploading} className="px-4 py-2 bg-club-600 text-white rounded-lg font-bold disabled:opacity-50 flex items-center gap-2">{isSaving ? 'Speichert...' : 'Speichern'}{githubToken && <UploadCloud size={16}/>}</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bulk Actions */}
                {!editingEvent && events.length > 0 && (
                    <div className="mb-4 flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <select className="p-2 rounded-lg border border-slate-300 text-sm" value={bulkActionCategory} onChange={e => setBulkActionCategory(e.target.value)}>{DEPARTMENTS.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}</select>
                        <button onClick={handleBulkUpdate} disabled={selectedEventIds.size === 0 || isSaving} className="bg-white border border-slate-200 text-slate-700 hover:text-club-600 px-3 py-2 rounded-lg text-sm font-bold disabled:opacity-50">Zuweisen ({selectedEventIds.size})</button>
                    </div>
                )}

                {/* Event List */}
                {!editingEvent && (
                    <div className="space-y-3">
                        {events.filter(e => e.status === 'approved' || e.status === undefined).map(event => (
                            <div key={event.id} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:shadow-sm">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-club-600 focus:ring-club-500" checked={selectedEventIds.has(event.id)} onChange={() => toggleEventSelection(event.id)} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between">
                                        <div className="font-bold text-slate-900 truncate">{event.title}</div>
                                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{getDepartmentName(event.departmentId)}</span>
                                    </div>
                                    <div className="text-xs text-slate-500">{new Date(event.startDate).toLocaleDateString()} • {event.startTime} Uhr • {event.location}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingEvent(event)} className="p-2 text-slate-400 hover:text-club-600 rounded-lg"><Edit2 size={16}/></button>
                                    <button onClick={() => confirmAction(`Termin "${event.title}" löschen?`, () => handleDeleteEvent(event.id))} className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* --- PARTNERS TAB --- */}
        {activeTab === 'partners' && currentUser.role === 'admin' && (
             <div>
                {!editingPartner ? (
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-slate-900">Sponsoren verwalten</h3>
                        <button onClick={handleCreatePartner} className="bg-club-600 hover:bg-club-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"><Plus size={16} /> Partner hinzufügen</button>
                    </div>
                ) : (
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">Sponsoren verwalten</h3>
                )}
                
                {editingPartner && (
                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
                        <h4 className="font-bold mb-4">{partners.some(p => p.id === editingPartner.id) ? 'Partner bearbeiten' : 'Neuen Partner anlegen'}</h4>
                        <div className="space-y-6">
                            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Logo / Grafik</label><div onClick={() => partnerImageInputRef.current?.click()} className={`relative w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group ${editingPartner.imageUrl ? 'border-club-200 bg-slate-50 h-auto min-h-[160px]' : 'border-slate-300 hover:border-club-400 hover:bg-club-50 h-40'}`}>{editingPartner.imageUrl ? (<><div className="w-full h-48 p-4 flex items-center justify-center"><img src={editingPartner.imageUrl} alt="Preview" className="w-full h-full object-contain" /></div><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">Bild ändern</div></>) : (<div className="text-center text-slate-400 group-hover:text-club-600"><ImageIcon size={32} className="mx-auto mb-2" /><span className="text-sm">Logo hochladen</span></div>)}<input type="file" ref={partnerImageInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setEditingPartner)} /></div></div>
                            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name (Titel) - Pflichtfeld</label><input className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm focus:ring-2 focus:ring-club-500 focus:outline-none" value={editingPartner.name || ''} onChange={e => setEditingPartner({...editingPartner, name: e.target.value})} placeholder="Firmenname" /></div>
                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200"><button onClick={() => setEditingPartner(null)} className="px-4 py-2 text-slate-500 hover:bg-slate-200 rounded-lg">Abbrechen</button><button onClick={handleSaveEditedPartner} disabled={isSaving} className="px-4 py-2 bg-club-600 text-white rounded-lg font-bold disabled:opacity-50 flex items-center gap-2">{isSaving ? 'Speichert...' : 'Speichern'}{githubToken && <UploadCloud size={16}/>}</button></div>
                        </div>
                     </div>
                )}

                {!editingPartner && (
                    <div>
                        <h4 className="font-bold mb-4 text-slate-700 uppercase text-xs flex items-center gap-2">
                             <Handshake size={14} /> Aktuelle Partner ({partners.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {partners.length === 0 && (
                                <div className="col-span-full text-center py-10 text-slate-400">Keine Partner vorhanden.</div>
                            )}
                            {partners.map(p => (
                                 <div key={p.id} className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-sm flex flex-col group">
                                    <div className="h-32 p-4 bg-slate-50 flex items-center justify-center border-b border-slate-50 relative">
                                        {p.imageUrl ? (
                                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="text-slate-300 font-bold text-xl text-center px-2">{p.name}</div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button onClick={() => setEditingPartner(p)} className="p-2 bg-white text-slate-600 hover:text-club-600 rounded-lg shadow-sm" title="Bearbeiten"><Edit2 size={16}/></button>
                                            <button onClick={() => confirmAction(`Partner ${p.name} löschen?`, () => handleDeletePartner(p.id))} className="p-2 bg-white text-slate-600 hover:text-red-600 rounded-lg shadow-sm" title="Löschen"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                    <div className="p-3 text-center">
                                        <h4 className="font-bold text-slate-900 text-sm truncate">{p.name}</h4>
                                    </div>
                                 </div>
                            ))}
                        </div>
                    </div>
                )}
             </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && checkAccess(currentUser, 'tennis') && (
            <div>
               <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900">Bildergalerie (Tennis)</h3>
                    <div className="flex gap-3">
                         {hasGalleryChanges && (
                             <button onClick={handlePersistGallery} disabled={isSaving} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 animate-pulse"><Save size={16} /> Änderungen speichern</button>
                         )}
                         <div className="relative">
                            <button onClick={() => galleryInputRef.current?.click()} className="bg-club-600 hover:bg-club-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"><Upload size={16} /> Bilder hochladen</button>
                            <input type="file" ref={galleryInputRef} multiple accept="image/*" onChange={handleGalleryFiles} className="hidden" />
                        </div>
                    </div>
               </div>
               
               {/* Pending Uploads */}
                {pendingGalleryImages.length > 0 && (
                    <div className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 className="font-bold mb-3">Warteschlange ({pendingGalleryImages.length})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {pendingGalleryImages.map((img, i) => (
                                <div key={i} className="relative group aspect-video bg-white rounded-lg overflow-hidden border border-slate-200">
                                    <img src={img.imageUrl} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 w-full p-1 bg-black/50"><input className="w-full text-xs bg-transparent text-white border-none p-0 focus:ring-0" placeholder="Titel..." value={img.title} onChange={(e) => { const newArr=[...pendingGalleryImages]; newArr[i].title=e.target.value; setPendingGalleryImages(newArr); }} /></div>
                                    <button onClick={() => setPendingGalleryImages(pendingGalleryImages.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X size={12}/></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleSaveGalleryImages} disabled={isSaving} className="w-full py-2 bg-club-600 text-white rounded-lg font-bold">{isSaving ? 'Lade hoch...' : 'Alle hochladen'}</button>
                    </div>
                )}

                {/* Existing Gallery */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryImages.map((img, i) => (
                        <div key={img.id} className="relative group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="aspect-video">
                                <img src={img.imageUrl} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-2 border-t border-slate-50">
                                <input 
                                    value={img.title} 
                                    onChange={(e) => handleGalleryTitleChange(img.id, e.target.value)}
                                    placeholder="Titel eingeben..."
                                    className="w-full text-xs font-bold text-slate-700 bg-transparent border-none p-1 focus:ring-1 focus:ring-club-500 focus:bg-slate-50 rounded transition-colors"
                                />
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex flex-col gap-1">
                                     <button onClick={() => moveGalleryImage(i, 'up')} className="p-1.5 bg-white/90 rounded-lg hover:bg-white shadow-sm disabled:opacity-50 text-slate-600 hover:text-club-600" disabled={i===0}><ArrowUp size={14}/></button>
                                     <button onClick={() => moveGalleryImage(i, 'down')} className="p-1.5 bg-white/90 rounded-lg hover:bg-white shadow-sm disabled:opacity-50 text-slate-600 hover:text-club-600" disabled={i===galleryImages.length-1}><ArrowDown size={14}/></button>
                                </div>
                                <button onClick={() => confirmAction("Bild löschen?", () => handleDeleteGalleryImage(img.id))} className="p-1.5 bg-white/90 text-slate-600 hover:text-red-600 hover:bg-white rounded-lg h-fit shadow-sm"><Trash2 size={14}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
    
    {/* ... (Import Modal) ... */}
    {showImportModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowImportModal(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Termine importieren</h3>
                        <p className="text-sm text-slate-500">{importCandidates.length} Einträge gefunden</p>
                    </div>
                    <button onClick={() => setShowImportModal(false)}><X size={24} className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                     {importCandidates.length === 0 ? (
                         <p className="text-center text-slate-500 py-8">Keine gültigen Termine in der Datei gefunden.</p>
                     ) : (
                         <div className="space-y-3">
                             {importCandidates.some(c => c.isDuplicate) && (
                                 <div className="bg-orange-50 border border-orange-200 text-orange-800 p-3 rounded-xl text-sm flex gap-2 items-start mb-4">
                                     <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                     <div><strong>Achtung:</strong> Es wurden Duplikate erkannt (gleicher Titel, Datum & Uhrzeit). Diese sind standardmäßig nicht ausgewählt.</div>
                                 </div>
                             )}
                             {importCandidates.map((c, idx) => (
                                 <div key={c.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${c.isDuplicate ? (c.selected ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200 opacity-60') : (c.selected ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200')}`} onClick={() => { const updated = [...importCandidates]; updated[idx].selected = !updated[idx].selected; setImportCandidates(updated); }}>
                                     <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${c.selected ? 'bg-club-600 border-club-600' : 'bg-white border-slate-300'}`}>{c.selected && <Check size={12} className="text-white" />}</div>
                                     <div className="flex-1">
                                         <div className="flex justify-between"><h4 className={`font-bold ${c.isDuplicate ? 'text-orange-700' : 'text-slate-900'}`}>{c.title}</h4>{c.isDuplicate && <span className="text-[10px] font-bold uppercase bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded h-fit">Duplikat</span>}</div>
                                         <div className="text-xs text-slate-500 mt-1">{new Date(c.startDate).toLocaleDateString()} • {c.startTime} Uhr • {c.location}</div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-between items-center">
                    <div className="text-xs text-slate-500">{importCandidates.filter(c => c.selected).length} ausgewählt</div>
                    <div className="flex gap-3">
                        <button onClick={() => setShowImportModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium">Abbrechen</button>
                        <button onClick={handleFinishImport} disabled={isSaving || importCandidates.filter(c => c.selected).length === 0} className="px-4 py-2 bg-club-600 text-white rounded-lg font-bold disabled:opacity-50 flex items-center gap-2">{isSaving ? 'Importiere...' : 'Auswahl importieren'}</button>
                    </div>
                </div>
            </div>
        </div>
    )}

    {notification && <Toast message={notification.msg} type={notification.type} onClose={() => setNotification(null)} />}
    {confirmData && <ConfirmDialog message={confirmData.msg} onConfirm={() => { confirmData.action(); setConfirmData(null); }} onCancel={() => setConfirmData(null)} />}
    </>
  );
};

export default AdminDashboard;