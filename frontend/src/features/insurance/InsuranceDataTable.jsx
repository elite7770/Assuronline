import { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronUp, 
  ChevronDown, 
  Filter
} from 'lucide-react';

const InsuranceDataTable = ({
  title,
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data available',
  searchable = true,
  sortable = true,
  filterable = true,
  pagination = true,
  pageSize = 10,
  actions = [],
  onRowClick,
  className = '',
  searchPlaceholder = 'Search...',
  showHeader = true,
  striped = false,
  hoverable = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search
    if (searchTerm && searchable) {
      filtered = filtered.filter(row =>
        columns.some(column => {
          const value = row[column.accessor];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (sortConfig.key && sortable) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig, searchable, sortable, columns]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = pagination ? filteredData.slice(startIndex, endIndex) : filteredData;

  // Handle sorting
  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };


  // Get status badge component
  const getStatusBadge = (value, _type = 'default') => {
    const statusClasses = {
      active: 'bg-success-100 text-success-700 border-success-200',
      approved: 'bg-success-100 text-success-700 border-success-200',
      paid: 'bg-success-100 text-success-700 border-success-200',
      pending: 'bg-warning-100 text-warning-700 border-warning-200',
      processing: 'bg-primary-100 text-primary-700 border-primary-200',
      expired: 'bg-danger-100 text-danger-700 border-danger-200',
      rejected: 'bg-danger-100 text-danger-700 border-danger-200',
      failed: 'bg-danger-100 text-danger-700 border-danger-200',
      default: 'bg-neutral-100 text-neutral-700 border-neutral-200'
    };

    const classes = statusClasses[value?.toLowerCase()] || statusClasses.default;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${classes}`}>
        {value}
      </span>
    );
  };

  // Render cell content
  const renderCell = (row, column) => {
    const value = row[column.accessor];
    
    if (column.render) {
      return column.render(value, row);
    }
    
    if (column.type === 'status') {
      return getStatusBadge(value);
    }
    
    if (column.type === 'date') {
      return new Date(value).toLocaleDateString();
    }
    
    if (column.type === 'currency') {
      return `${Number(value).toLocaleString()} MAD`;
    }
    
    return value;
  };

  if (loading) {
    return (
      <div className={`insurance-card ${className}`}>
        {showHeader && (
          <div className="insurance-card-header">
            <div className="animate-pulse">
              <div className="h-6 bg-neutral-200 rounded w-48 mb-4"></div>
              <div className="h-10 bg-neutral-200 rounded w-full"></div>
            </div>
          </div>
        )}
        <div className="insurance-card-body">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`insurance-card ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="insurance-card-header">
          <div className="mb-6">
            <h3 className="dashboard-table-title-enhanced text-xl font-bold text-text-primary mb-4 text-center">{title}</h3>
            <div className="flex items-center gap-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="insurance-btn insurance-btn-secondary"
                  title={action.title}
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            {searchable && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-input bg-surface text-text-primary text-sm focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>
            )}
            
            {filterable && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="insurance-btn insurance-btn-secondary"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="insurance-table">
          <thead>
            <tr>
              {columns.map((column) => (
              <th
                key={column.accessor}
                className={`${sortable ? 'cursor-pointer hover:bg-surface-tertiary' : ''}`}
                onClick={() => handleSort(column.accessor)}
              >
                <div className="flex items-center gap-2">
                  <span>{column.header}</span>
                  {sortable && (
                    <div className="flex flex-col">
                      <ChevronUp 
                        className={`h-3 w-3 ${
                          sortConfig.key === column.accessor && sortConfig.direction === 'asc' 
                            ? 'text-primary-600' 
                            : 'text-text-tertiary'
                        }`} 
                      />
                      <ChevronDown 
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig.key === column.accessor && sortConfig.direction === 'desc' 
                            ? 'text-primary-600' 
                            : 'text-text-tertiary'
                        }`} 
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <div className="insurance-empty">
                    <div className="insurance-empty-icon">
                      <Search className="h-12 w-12 mx-auto text-text-tertiary" />
                    </div>
                    <div className="insurance-empty-title">No data found</div>
                    <div className="insurance-empty-description">{emptyMessage}</div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={`${hoverable ? 'hover:bg-surface-secondary' : ''} ${striped && index % 2 === 0 ? 'bg-surface-secondary' : ''} ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td key={column.accessor}>
                      {renderCell(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="insurance-card-footer">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="insurance-btn insurance-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-button text-sm font-medium transition-colors ${
                      currentPage === i + 1
                        ? 'bg-primary text-white'
                        : 'bg-surface text-text-primary hover:bg-surface-secondary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="insurance-btn insurance-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceDataTable;
