import { useState } from 'react';
import { ChevronUp, ChevronDown, Search, Shield, FileText, Users, DollarSign, Calendar, AlertCircle } from 'lucide-react';

const DataTable = ({
  columns = [],
  rows = [],
  loading = false,
  emptyMessage = 'No data available',
  emptyDescription = 'Data will appear here once available',
  emptyIcon = 'FileText',
  renderActions,
  className = '',
  title,
  searchable = false,
  sortable = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Icon mapping for different table types
  const iconMap = {
    FileText,
    Shield,
    Users,
    DollarSign,
    Calendar,
    AlertCircle,
  };

  const EmptyIcon = iconMap[emptyIcon] || FileText;

  // Filter rows based on search term
  const filteredRows = searchable && searchTerm
    ? rows.filter(row =>
        columns.some(col => {
          const value = row[col.accessor];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      )
    : rows;

  // Sort rows
  const sortedRows = sortable && sortConfig.key
    ? [...filteredRows].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : filteredRows;

  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className={`bg-slate-800 dark:bg-slate-800 rounded-xl shadow-lg border border-slate-700 dark:border-slate-700 hover-lift ${className}`}>
      <div className="p-6">
        {title && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white dark:text-white mb-4">{title}</h3>
            {searchable && (
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-300 dark:text-gray-300">
                  {sortedRows.length} {sortedRows.length === 1 ? 'item' : 'items'}
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse space-y-3 w-full">
              <div className="h-4 bg-slate-700 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-700 dark:bg-slate-700 rounded w-1/2"></div>
              <div className="h-4 bg-slate-700 dark:bg-slate-700 rounded w-5/6"></div>
            </div>
          </div>
        ) : sortedRows.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 dark:text-slate-400 mb-4">
              <EmptyIcon className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-white dark:text-white mb-2">{emptyMessage}</h3>
            <p className="text-gray-300 dark:text-gray-300">{emptyDescription}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700 dark:divide-slate-700">
              <thead className="bg-slate-700 dark:bg-slate-700">
                <tr>
                  {columns.map((col) => (
                    <th 
                      key={col.key || col.accessor}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-300 dark:text-gray-300 uppercase tracking-wider ${
                        sortable ? 'cursor-pointer hover:bg-slate-600 dark:hover:bg-slate-600' : ''
                      }`}
                      onClick={() => handleSort(col.accessor)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{col.header}</span>
                        {sortable && sortConfig.key === col.accessor && (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                  ))}
                  {renderActions && <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 dark:text-gray-300 uppercase tracking-wider">Actions</th>}
                </tr>
              </thead>
              <tbody className="bg-slate-800 dark:bg-slate-800 divide-y divide-slate-700 dark:divide-slate-700">
                {sortedRows.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-700 dark:hover:bg-slate-700 transition-colors">
                    {columns.map((col) => (
                      <td key={(col.key || col.accessor) + String(row.id || idx)} className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-white">
                        {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                      </td>
                    ))}
                    {renderActions && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {renderActions(row)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;



