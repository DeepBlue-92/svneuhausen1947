
export interface PageView {
  page: string;
  subId?: string; // e.g. sport department
  timestamp: number;
  device: 'mobile' | 'desktop';
}

export interface AnalyticsSummary {
  totalViews: number;
  viewsByPage: Record<string, number>;
  viewsByDepartment: Record<string, number>;
  viewsByMonth: { date: string; label: string; count: number }[]; // Changed to Monthly
  deviceSplit: { mobile: number; desktop: number };
}

const STORAGE_KEY = 'svn_analytics_data';

// Helper to generate some dummy data for demonstration if empty
const seedData = (): PageView[] => {
  const data: PageView[] = [];
  const now = Date.now();
  const day = 86400000;
  const pages = ['aktuelles', 'calendar', 'kontakt', 'sport-detail', 'history', 'membership'];
  const depts = ['fussball', 'tennis', 'karate', 'kinderturnen', 'turndichfit'];

  // Generate 800 random views over last 12 months (approx 365 days)
  for (let i = 0; i < 800; i++) {
    const timeOffset = Math.floor(Math.random() * 365 * day);
    const p = pages[Math.floor(Math.random() * pages.length)];
    const isSport = p === 'sport-detail';
    
    data.push({
      page: p,
      subId: isSport ? depts[Math.floor(Math.random() * depts.length)] : undefined,
      timestamp: now - timeOffset,
      device: Math.random() > 0.6 ? 'mobile' : 'desktop'
    });
  }
  return data;
};

export const trackPageView = (page: string, subId?: string) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let history: PageView[] = raw ? JSON.parse(raw) : [];

    // Seed if empty (for demo purposes)
    if (history.length === 0) {
        history = seedData();
    }

    const newView: PageView = {
      page,
      subId: subId || undefined,
      timestamp: Date.now(),
      device: window.innerWidth < 768 ? 'mobile' : 'desktop'
    };

    history.push(newView);
    
    // Keep only last 5000 entries to prevent storage overflow but allow monthly stats
    if (history.length > 5000) history = history.slice(-5000);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('Analytics tracking failed', e);
  }
};

export const getRawAnalyticsData = (): PageView[] => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seedData();
};

export const getAnalyticsData = (): AnalyticsSummary => {
  const history = getRawAnalyticsData();

  const summary: AnalyticsSummary = {
    totalViews: history.length,
    viewsByPage: {},
    viewsByDepartment: {},
    viewsByMonth: [],
    deviceSplit: { mobile: 0, desktop: 0 }
  };

  const monthCounts: Record<string, number> = {};
  
  // Initialize last 12 months with 0
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      // Key format: YYYY-MM
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthCounts[key] = 0;
  }

  history.forEach(view => {
    // Page Views
    const pageKey = view.page;
    summary.viewsByPage[pageKey] = (summary.viewsByPage[pageKey] || 0) + 1;

    // Dept Views
    if (view.subId) {
       summary.viewsByDepartment[view.subId] = (summary.viewsByDepartment[view.subId] || 0) + 1;
    }

    // Devices
    if (view.device === 'mobile') summary.deviceSplit.mobile++;
    else summary.deviceSplit.desktop++;

    // Timeline (Monthly)
    const date = new Date(view.timestamp);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Only count if within our initialized range (last 12 months)
    if (monthCounts[key] !== undefined) {
        monthCounts[key]++;
    }
  });

  // Convert map to array and format label
  summary.viewsByMonth = Object.keys(monthCounts).sort().map(key => {
      const [year, month] = key.split('-');
      const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
      return {
          date: key,
          label: dateObj.toLocaleDateString('de-DE', { month: 'short', year: '2-digit' }), // e.g. "Jan 24"
          count: monthCounts[key]
      };
  });

  return summary;
};
