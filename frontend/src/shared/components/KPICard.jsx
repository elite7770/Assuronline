import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const gradientIconClasses = {
  primary: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  success: 'bg-gradient-to-br from-emerald-500 to-teal-600',
  warning: 'bg-gradient-to-br from-amber-500 to-orange-600',
  info: 'bg-gradient-to-br from-cyan-500 to-blue-600',
  danger: 'bg-gradient-to-br from-red-500 to-rose-600',
};

const KPICard = ({
  title,
  value,
  change,
  icon: Icon,
  loading = false,
  className = '',
  gradient = 'primary',
  onClick,
}) => {
  if (loading) {
    return (
      <div className={`bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 animate-pulse ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="h-4 w-24 bg-slate-700 rounded" />
          <div className="w-10 h-10 bg-slate-700 rounded-xl" />
        </div>
        <div className="h-8 w-20 bg-slate-700 rounded mb-2" />
        <div className="h-3 w-32 bg-slate-700 rounded" />
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600/70 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${gradientIconClasses[gradient]}`}>
          {Icon && <Icon className="w-5 h-5 text-white" />}
        </div>
      </div>

      <p className="text-2xl font-bold text-white mb-2">{value}</p>

      {change && (
        <div className="flex items-center gap-1.5">
          {change.type === 'increase' ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          ) : change.type === 'decrease' ? (
            <TrendingDown className="h-3.5 w-3.5 text-red-400" />
          ) : (
            <Minus className="h-3.5 w-3.5 text-slate-400" />
          )}
          <span className={`text-xs font-semibold ${change.type === 'increase' ? 'text-emerald-400' : change.type === 'decrease' ? 'text-red-400' : 'text-slate-400'}`}>
            {change.value > 0 ? '+' : ''}{change.value}%
          </span>
          <span className="text-slate-600 text-xs">{change.period || 'vs last period'}</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
