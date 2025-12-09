
const ActivityFeed = ({ title = 'Recent Activity', items = [], loading = false, emptyMessage = 'No recent activity' }) => {
  return (
    <div className="card hover-lift">
      <div className="card-header">
        <div className="card-title dashboard-enhanced-title">{title}</div>
      </div>
      <div className="card-body">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse h-5 bg-gray-200 rounded" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="empty">{emptyMessage}</div>
        ) : (
          <ul className="space-y-4">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2" style={{ background: item.color || '#60a5fa' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                    <span className="font-semibold">{item.actor}</span> {item.action}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;




