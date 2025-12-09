import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
  const gradientVariants = {
    primary: 'dashboard-kpi-card--primary',
    success: 'dashboard-kpi-card--success',
    warning: 'dashboard-kpi-card--warning',
    info: 'dashboard-kpi-card--info',
    danger: 'dashboard-kpi-card--danger',
  };

  const iconBgClasses = {
    primary: 'bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600',
    success: 'bg-gradient-to-br from-green-50 to-emerald-100 text-green-600',
    warning: 'bg-gradient-to-br from-amber-50 to-orange-100 text-amber-600',
    info: 'bg-gradient-to-br from-cyan-50 to-blue-100 text-cyan-600',
    danger: 'bg-gradient-to-br from-red-50 to-rose-100 text-red-600',
  };

  const getChangeIcon = (change) => {
    if (!change) return null;
    
    if (change.type === 'increase') {
      return <TrendingUp className="dashboard-kpi-change-icon" />;
    } else if (change.type === 'decrease') {
      return <TrendingDown className="dashboard-kpi-change-icon" />;
    } else {
      return <Minus className="dashboard-kpi-change-icon" />;
    }
  };

  const getChangeColor = (change) => {
    if (!change) return 'dashboard-kpi-change--neutral';
    
    if (change.type === 'increase') {
      return 'dashboard-kpi-change--positive';
    } else if (change.type === 'decrease') {
      return 'dashboard-kpi-change--negative';
    } else {
      return 'dashboard-kpi-change--neutral';
    }
  };

  if (loading) {
    return (
      <div className={`dashboard-kpi-card ${gradientVariants[gradient]} ${className}`}>
        <div className="dashboard-kpi-header">
          <div className="dashboard-kpi-skeleton dashboard-kpi-skeleton-title"></div>
          <div className={`dashboard-kpi-icon ${iconBgClasses[gradient]} dashboard-kpi-skeleton`}></div>
        </div>
        <div className="dashboard-kpi-skeleton dashboard-kpi-skeleton-value"></div>
        <div className="dashboard-kpi-skeleton dashboard-kpi-skeleton-change"></div>
      </div>
    );
  }

  return (
    <div 
      className={`dashboard-kpi-card ${gradientVariants[gradient]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="dashboard-kpi-header">
        <h3 className="dashboard-kpi-title">{title}</h3>
        <div className={`dashboard-kpi-icon ${iconBgClasses[gradient]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      <p className="dashboard-kpi-value">{value}</p>
      
      {change && (
        <div className="dashboard-kpi-change">
          {getChangeIcon(change)}
          <span className={getChangeColor(change)}>
            {change.value > 0 ? '+' : ''}{change.value}%
          </span>
          <span className="dashboard-kpi-period">
            {change.period || 'vs last period'}
          </span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
