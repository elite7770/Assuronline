import { TrendingUp, BarChart3, PieChart, Activity, BarChart, Calendar, DollarSign } from 'lucide-react';

const ChartCard = ({
  title,
  children,
  loading = false,
  className = '',
  chartType = 'line',
  subtitle,
  isEmpty = false,
  emptyMessage = 'Aucune donnée disponible',
  emptyDescription = 'Les données apparaîtront ici une fois disponibles',
  contentHeight = 'h-48',
}) => {
  const chartIcons = {
    line: TrendingUp,
    bar: BarChart3,
    pie: PieChart,
    area: Activity,
    gauge: Activity,
  };

  const emptyStateIcons = {
    line: BarChart,
    bar: BarChart3,
    pie: PieChart,
    area: Activity,
    payment: DollarSign,
    calendar: Calendar,
    gauge: Activity,
  };

  const Icon = chartIcons[chartType] || TrendingUp;
  const EmptyIcon = emptyStateIcons[chartType] || BarChart;

  return (
    <div className={`bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 overflow-hidden ${className}`}>
      <div className="p-5 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Icon className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="h-48 bg-slate-700/40 rounded-xl animate-pulse" />
        ) : isEmpty ? (
          <div className="h-48 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-700/60 flex items-center justify-center mb-3">
              <EmptyIcon className="w-6 h-6 text-slate-500" />
            </div>
            <h4 className="text-slate-400 font-medium text-sm mb-1">{emptyMessage}</h4>
            <p className="text-slate-600 text-xs max-w-xs">{emptyDescription}</p>
          </div>
        ) : (
          <div className={contentHeight}>{children}</div>
        )}
      </div>
    </div>
  );
};

export default ChartCard;
