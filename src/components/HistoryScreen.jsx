'use client';

const ROLE_ICON = { contractor: '📸', employer: '🏢' };
const MEDIA_ICON = { photo: '📷', video: '🎬', 'photo+video': '✨' };

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const fmt = (n) => `$${Number(n).toLocaleString()}`;

export default function HistoryScreen({ history, onView, onDelete }) {
  if (!history || history.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <div className="empty-title">No history yet</div>
        <div className="empty-sub">Your past rate calculations will show up here after you run your first one.</div>
      </div>
    );
  }

  return (
    <div className="history-screen">
      <div className="history-header">
        <h2 className="history-title">History</h2>
        <p className="history-sub">{history.length} calculation{history.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-card" onClick={() => onView(item)}>
            <div className="hcard-left">
              <div className={`hcard-icon ${item.role === 'contractor' ? 'hcard-blue' : 'hcard-purple'}`}>
                {ROLE_ICON[item.role]}
              </div>
            </div>
            <div className="hcard-body">
              <div className="hcard-top">
                <span className="hcard-type">
                  {MEDIA_ICON[item.mediaType]} {item.projectType}
                </span>
                <span className="hcard-time">{timeAgo(item.date)}</span>
              </div>
              <div className="hcard-rate">{fmt(item.recommended)}</div>
              <div className="hcard-range">
                {fmt(item.floor)} – {fmt(item.ceiling)}
              </div>
            </div>
            <button
              className="hcard-delete"
              onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
              aria-label="Delete"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
