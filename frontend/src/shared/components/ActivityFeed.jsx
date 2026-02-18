const ActivityFeed = ({ title = 'Activité Récente', items = [], loading = false, emptyMessage = 'Aucune activité récente' }) => {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 transition-all duration-300">
      <div className="px-5 py-4 border-b border-slate-700/50">
        <h3 className="text-white font-semibold text-sm">{title}</h3>
      </div>
      <div className="p-5">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-slate-700 mt-2 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-slate-700 rounded w-3/4" />
                  <div className="h-2.5 bg-slate-700/60 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-slate-500 text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0 ring-4 ring-slate-800"
                  style={{ background: item.color || '#60a5fa' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-sm leading-snug">
                    <span className="font-semibold text-white">{item.actor}</span>{' '}
                    {item.action}
                  </p>
                  <p className="text-slate-600 text-xs mt-0.5">{item.time}</p>
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
