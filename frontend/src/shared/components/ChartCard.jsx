import { TrendingUp, BarChart3, PieChart, Activity, BarChart, Calendar, DollarSign } from 'lucide-react';
import EnhancedFlexHeader from './EnhancedFlexHeader';

const ChartCard = ({
  title,
  children,
  loading = false,
  className = '',
  chartType = 'line',
  subtitle,
  isEmpty = false,
  emptyMessage = 'No data available',
  emptyDescription = 'Data will appear here once available',
}) => {
  const chartIcons = {
    line: TrendingUp,
    bar: BarChart3,
    pie: PieChart,
    area: Activity,
  };

  const emptyStateIcons = {
    line: BarChart,
    bar: BarChart3,
    pie: PieChart,
    area: Activity,
    payment: DollarSign,
    calendar: Calendar,
  };

  const Icon = chartIcons[chartType];
  const EmptyIcon = emptyStateIcons[chartType] || BarChart;

  return (
    <div className={`card hover-lift group ${className}`}>
      <div className="p-6">
        <EnhancedFlexHeader
          title={title}
          subtitle={subtitle}
          icon={Icon}
          iconColor="blue"
        />

        {loading ? (
          <div className="dashboard-chart-loading">
            <div className="dashboard-chart-skeleton"></div>
          </div>
        ) : isEmpty ? (
          <div className="dashboard-chart-container">
            <div className="dashboard-chart-overlay" />
            <div className="dashboard-chart-content">
              <div className="dashboard-empty-state">
                <div className="dashboard-empty-icon">
                  <EmptyIcon className="w-12 h-12" />
                </div>
                <h3 className="dashboard-empty-title">{emptyMessage}</h3>
                <p className="dashboard-empty-description">{emptyDescription}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-chart-container">
            <div className="dashboard-chart-overlay" />
            <div className="dashboard-chart-content">{children}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartCard;
