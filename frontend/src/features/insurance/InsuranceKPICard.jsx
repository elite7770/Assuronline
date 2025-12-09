import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const InsuranceKPICard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  gradient = 'primary',
  loading = false,
  className = '',
  onClick 
}) => {
  // Future implementation for gradient classes
  // const _getGradientClasses = (gradient) => {
  //   switch (gradient) {
  //     case 'primary':
  //       return 'from-primary-500 to-primary-600';
  //     case 'success':
  //       return 'from-success-500 to-success-600';
  //     case 'warning':
  //       return 'from-warning-500 to-warning-600';
  //     case 'danger':
  //       return 'from-danger-500 to-danger-600';
  //     case 'info':
  //       return 'from-neutral-500 to-neutral-600';
  //     default:
  //       return 'from-primary-500 to-primary-600';
  //   }
  // };

  const getIconBgClasses = (gradient) => {
    switch (gradient) {
      case 'primary':
        return 'bg-primary-100 text-primary-600';
      case 'success':
        return 'bg-success-100 text-success-600';
      case 'warning':
        return 'bg-warning-100 text-warning-600';
      case 'danger':
        return 'bg-danger-100 text-danger-600';
      case 'info':
        return 'bg-neutral-100 text-neutral-600';
      default:
        return 'bg-primary-100 text-primary-600';
    }
  };

  const getChangeIcon = (change) => {
    if (!change) return null;
    
    if (change.type === 'increase') {
      return <TrendingUp className="h-4 w-4 text-success-600" />;
    } else if (change.type === 'decrease') {
      return <TrendingDown className="h-4 w-4 text-danger-600" />;
    } else {
      return <Minus className="h-4 w-4 text-neutral-500" />;
    }
  };

  const getChangeColor = (change) => {
    if (!change) return 'text-neutral-500';
    
    if (change.type === 'increase') {
      return 'text-success-600';
    } else if (change.type === 'decrease') {
      return 'text-danger-600';
    } else {
      return 'text-neutral-500';
    }
  };

  // Future implementation for change background classes
  // const _getChangeBg = (change) => {
  //   if (!change) return 'bg-neutral-100';
  //   
  //   if (change.type === 'increase') {
  //     return 'bg-success-100';
  //   } else if (change.type === 'decrease') {
  //     return 'bg-danger-100';
  //   } else {
  //     return 'bg-neutral-100';
  //   }
  // };

  if (loading) {
    return (
      <div className={`dashboard-kpi-card dashboard-kpi-card--${gradient} ${className}`}>
        <div className="dashboard-kpi-header">
          <div className="dashboard-kpi-skeleton dashboard-kpi-skeleton-title"></div>
          <div className={`dashboard-kpi-icon ${getIconBgClasses(gradient)} dashboard-kpi-skeleton`}></div>
        </div>
        <div className="dashboard-kpi-skeleton dashboard-kpi-skeleton-value"></div>
        <div className="dashboard-kpi-skeleton dashboard-kpi-skeleton-change"></div>
      </div>
    );
  }

  return (
    <div 
      className={`dashboard-kpi-card dashboard-kpi-card--${gradient} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="dashboard-kpi-header">
        <h3 className="dashboard-kpi-title">{title}</h3>
        <div className={`dashboard-kpi-icon ${getIconBgClasses(gradient)}`}>
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

export default InsuranceKPICard;
