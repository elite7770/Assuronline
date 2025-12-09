
const EnhancedFlexHeader = ({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'blue',
  children,
  className = '',
  showDivider: _showDivider = true,
}) => {
  const iconColorClasses = {
    blue: 'dashboard-flex-header-icon--blue',
    green: 'dashboard-flex-header-icon--green',
    amber: 'dashboard-flex-header-icon--amber',
  };

  return (
    <div className={`dashboard-flex-header ${className}`}>
      <div className="dashboard-flex-header-left">
        {Icon && (
          <div className={`dashboard-flex-header-icon ${iconColorClasses[iconColor]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h3 className="dashboard-chart-title-enhanced">{title}</h3>
          {subtitle && (
            <p className="dashboard-flex-header-subtitle">{subtitle}</p>
          )}
        </div>
      </div>
      
      {children && (
        <div className="dashboard-flex-header-right">
          {children}
        </div>
      )}
    </div>
  );
};

export default EnhancedFlexHeader;
