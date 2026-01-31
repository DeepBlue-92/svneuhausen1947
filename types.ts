

export interface NewsItem {
  id: number;
  date: string;
  title: string;
  category: string;
}

export interface EventItem {
  id: number;
  date: string;
  time: string;
  match: string;
  location: string;
}

export interface Sport {
  id: string;
  name: string;
  iconName: string; // Used to map to Lucide icons
  description: string;
}

export interface Partner {
  id: string;
  name: string; // Used for headline/alt text
  description?: string; // New field for visible text
  imageUrl?: string; // For uploaded images (Base64)
  placeholderColor?: string; // Fallback for the default demo data
}

// CMS TYPES

export type Role = 'admin' | 'head';

export interface User {
  id: string;
  username: string;
  password?: string; // Local auth password
  displayName: string;
  role: Role;
  departmentId?: string; // If role is 'head', which department do they manage?
  avatarUrl?: string; // Optional Avatar
  accessToken?: string; // GitHub Access Token
}

export interface Post {
  id: string;
  title: string;
  content: string; // HTML-like string
  imageUrl?: string;
  pdfUrl?: string; // Optional PDF attachment
  date: string; // ISO String
  departmentId: string; // 'all' for general news, or specific sport ID
  authorId: string;
  author?: string; // Explicit display name of the author
  status?: 'approved' | 'pending'; // New field for approval workflow
}

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string; // ISO date YYYY-MM-DD
  startTime: string; // HH:mm
  endTime?: string; // HH:mm
  location: string;
  departmentId: string;
  imageUrl?: string; // Optional image for the event
  pdfUrl?: string; // Optional PDF attachment
  status?: 'approved' | 'pending'; // New field for approval workflow
}

export interface GalleryImage {
  id: string;
  title: string;
  imageUrl: string;
  departmentId: string;
}

export type PageType = 'aktuelles' | 'sport-detail' | 'kontakt' | 'impressum' | 'datenschutz' | 'partner' | 'shop' | 'admin-dashboard' | 'history' | 'membership' | 'news-archive' | 'calendar' | 'submission' | 'tennis-rules' | 'tennis-training';

export interface PermissionConfig {
  [key: string]: any;
}