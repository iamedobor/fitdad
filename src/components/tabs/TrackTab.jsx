import { useState } from 'react';
import { SubNav } from '../ui/SubNav.jsx';
import { ProgressView } from '../track/ProgressView.jsx';
import { JournalView } from '../track/JournalView.jsx';
import { PhotosView } from '../track/PhotosView.jsx';
import { AnalyticsView } from '../track/AnalyticsView.jsx';

const NAV = [
  { id: 'progress', label: 'Measurements' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'journal', label: 'Journal' },
  { id: 'photos', label: 'Photos' },
];

export function TrackTab() {
  const [view, setView] = useState('progress');
  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 20, fontWeight: 600 }}>Track</div>
      <SubNav options={NAV} value={view} onChange={setView} />
      {view === 'progress' && <ProgressView />}
      {view === 'analytics' && <AnalyticsView />}
      {view === 'journal' && <JournalView />}
      {view === 'photos' && <PhotosView />}
    </div>
  );
}
