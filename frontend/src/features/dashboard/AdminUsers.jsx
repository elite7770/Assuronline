import { useEffect, useState } from 'react';
import { 
  Users, RefreshCw, Search, Filter, ChevronDown, ChevronUp, 
  Clock, TrendingUp, 
  FileText, BarChart3, 
  Eye, Mail, Activity, Edit, Trash2, Calendar, Download,
  CheckCircle, XCircle, 
  Shield, UserCheck, MapPin,
  Crown, Key, Ban, Unlock, Phone
} from 'lucide-react';
import { adminUsersAPI } from '../../shared/services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, grid, analytics
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    status: '',
    role: '',
    date_from: '',
    date_to: '',
    search: '',
    last_login: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    pending: 0,
    admins: 0,
    clients: 0,
    newThisMonth: 0,
    lastLoginToday: 0
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Always use real API data
      const res = await adminUsersAPI.list();
      const usersData = Array.isArray(res.data) ? res.data : res.data?.users || [];
      const statistics = res.data?.statistics || {};
      
      setUsers(usersData);
      setStats(statistics);
      
    } catch (err) {
      console.error('Users fetch error:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // User action handlers
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleEditUser = async (userId) => {
    setActionLoading(true);
    try {
      // Call real API to get user details for editing
      const response = await adminUsersAPI.get(userId);
      console.log('Get user for edit response:', response);
      alert('User edit functionality would open here!');
    } catch (error) {
      console.error('Error getting user for edit:', error);
      alert('Error getting user details: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendUser = async (userId) => {
    if (!window.confirm('Are you sure you want to suspend this user?')) return;
    
    setActionLoading(true);
    try {
      // Call real API to suspend user
      const response = await adminUsersAPI.setStatus(userId, 'suspended');
      console.log('Suspend user response:', response);
      alert('User suspended successfully!');
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error('Error suspending user:', error);
      alert('Error suspending user: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateUser = async (userId) => {
    setActionLoading(true);
    try {
      // Call real API to activate user
      const response = await adminUsersAPI.setStatus(userId, 'active');
      console.log('Activate user response:', response);
      alert('User activated successfully!');
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error('Error activating user:', error);
      alert('Error activating user: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    setActionLoading(true);
    try {
      // Call real API to delete user
      const response = await adminUsersAPI.delete(userId);
      console.log('Delete user response:', response);
      alert('User deleted successfully!');
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (userId) => {
    if (!window.confirm('Are you sure you want to reset this user\'s password?')) return;
    
    setActionLoading(true);
    try {
      // Call real API to reset password
      const response = await adminUsersAPI.resetPassword(userId);
      console.log('Reset password response:', response);
      alert('Password reset email sent successfully!');
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Error resetting password: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendEmail = async (userId, userEmail) => {
    setActionLoading(true);
    try {
      // Call real API to send email
      const response = await adminUsersAPI.sendEmail(userId, userEmail);
      console.log('Send email response:', response);
      alert('Email sent successfully to ' + userEmail);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportUser = async (userId) => {
    setActionLoading(true);
    try {
      // Call real API to export user data
      const response = await adminUsersAPI.export(userId);
      console.log('Export user response:', response);
      
      // If response contains download URL, open it
      if (response.data?.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank');
        alert('User data exported successfully! Download started.');
      } else {
        alert('User data exported successfully!');
      }
    } catch (error) {
      console.error('Error exporting user data:', error);
      alert('Error exporting user data: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const filteredUsers = users.filter(user => {
    if (filters.status && user.status !== filters.status) return false;
    if (filters.role && user.role !== filters.role) return false;
    if (filters.date_from && new Date(user.created_at) < new Date(filters.date_from)) return false;
    if (filters.date_to && new Date(user.created_at) > new Date(filters.date_to)) return false;
    if (filters.last_login) {
      if (filters.last_login === 'today' && user.last_login) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastLogin = new Date(user.last_login);
        if (lastLogin < today) return false;
      } else if (filters.last_login === 'week' && user.last_login) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const lastLogin = new Date(user.last_login);
        if (lastLogin < weekAgo) return false;
      } else if (filters.last_login === 'month' && user.last_login) {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const lastLogin = new Date(user.last_login);
        if (lastLogin < monthAgo) return false;
      } else if (filters.last_login === 'never' && user.last_login) {
        return false;
      }
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.toLowerCase().includes(searchLower) ||
        user.city?.toLowerCase().includes(searchLower) ||
        user.occupation?.toLowerCase().includes(searchLower) ||
        user.company?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'created_at' || sortBy === 'last_login') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Future implementation for sorting
  // const handleSort = (column) => {
  //   if (sortBy === column) {
  //     setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  //   } else {
  //     setSortBy(column);
  //     setSortOrder('desc');
  //   }
  // };

  const clearFilters = () => {
    setFilters({
      status: '',
      role: '',
      date_from: '',
      date_to: '',
      search: '',
      last_login: ''
    });
  };

  const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : 'Never');
  const statusBadge = (status) => {
    const s = (status || '').toLowerCase();
    const map = {
      active: 'bg-green-900 text-green-300',
      suspended: 'bg-red-900 text-red-300',
      pending: 'bg-yellow-900 text-yellow-300',
    };
    const cls = map[s] || 'bg-gray-900 text-gray-300';
    return <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${cls}`}>{status || '-'}</span>;
  };

  const roleBadge = (role) => {
    const r = (role || '').toLowerCase();
    const map = {
      admin: 'bg-purple-900 text-purple-300',
      client: 'bg-blue-900 text-blue-300',
    };
    const cls = map[r] || 'bg-gray-900 text-gray-300';
    const displayName = r.charAt(0).toUpperCase() + r.slice(1);
    return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${cls}`}>{displayName}</span>;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (loading) return <div className="p-6 text-white">Loading users...</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white space-y-6 animate-fade-in p-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-indigo-100 text-lg">Comprehensive user administration and account management</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
            >
              {viewMode === 'table' ? <BarChart3 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
              <span>{viewMode === 'table' ? 'Grid View' : 'Table View'}</span>
            </button>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Total Users</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-indigo-900 rounded-full">
              <Users className="h-6 w-6 text-indigo-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-green-400 font-medium">+{stats.newThisMonth} this month</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Active Users</p>
              <p className="text-3xl font-bold text-green-400">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-900 rounded-full">
              <UserCheck className="h-6 w-6 text-green-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-green-400 font-medium">Currently active</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Online Today</p>
              <p className="text-3xl font-bold text-blue-400">{stats.lastLoginToday}</p>
            </div>
            <div className="p-3 bg-blue-900 rounded-full">
              <Activity className="h-6 w-6 text-blue-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Clock className="h-4 w-4 text-blue-400 mr-1" />
            <span className="text-blue-400 font-medium">Logged in today</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Admins</p>
              <p className="text-3xl font-bold text-purple-400">{stats.admins}</p>
            </div>
            <div className="p-3 bg-purple-900 rounded-full">
              <Crown className="h-6 w-6 text-purple-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Shield className="h-4 w-4 text-purple-400 mr-1" />
            <span className="text-purple-400 font-medium">Administrators</span>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Filters & Search</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-300 hover:text-white"
            >
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        <div className={`p-6 ${showFilters ? 'block' : 'hidden'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users, emails, cities..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-10 w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({...filters, role: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="client">Client</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Last Login</label>
              <select
                value={filters.last_login}
                onChange={(e) => setFilters({...filters, last_login: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="never">Never</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date From</label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => setFilters({...filters, date_from: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date To</label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => setFilters({...filters, date_to: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-end">
        <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
        >
                <Filter className="h-4 w-4" />
                <span>Clear All</span>
        </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Display */}
      {viewMode === 'table' ? (
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                Users ({filteredUsers.length})
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-1 text-sm"
                >
                  <option value="created_at">Date Created</option>
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="last_login">Last Login</option>
                  <option value="status">Status</option>
                  <option value="role">Role</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 text-gray-300 hover:text-white"
                >
                  {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {sortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-900 flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-300">
                              {getInitials(user.name)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-300">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{user.email}</div>
                      <div className="text-sm text-gray-300 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {user.phone || 'No phone'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {roleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {statusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDateTime(user.last_login)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {user.city || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900 rounded"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user.id)}
                          disabled={actionLoading}
                          className="p-1 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900 rounded disabled:opacity-50"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleSuspendUser(user.id)}
                            disabled={actionLoading}
                            className="p-1 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900 rounded disabled:opacity-50"
                            title="Suspend User"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateUser(user.id)}
                            disabled={actionLoading}
                            className="p-1 text-green-400 hover:text-green-300 hover:bg-green-900 rounded disabled:opacity-50"
                            title="Activate User"
                          >
                            <Unlock className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          disabled={actionLoading}
                          className="p-1 text-purple-400 hover:text-purple-300 hover:bg-purple-900 rounded disabled:opacity-50"
                          title="Reset Password"
                        >
                          <Key className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleSendEmail(user.id, user.email)}
                          disabled={actionLoading}
                          className="p-1 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900 rounded disabled:opacity-50"
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={actionLoading}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900 rounded disabled:opacity-50"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedUsers.map((user) => (
            <div key={user.id} className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl hover:bg-gray-750 transition-all">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-12 w-12">
                  <div className="h-12 w-12 rounded-full bg-indigo-900 flex items-center justify-center">
                    <span className="text-lg font-medium text-indigo-300">
                      {getInitials(user.name)}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                  <p className="text-sm text-gray-300">{user.email}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  {roleBadge(user.role)}
                  {statusBadge(user.status)}
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-300">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{user.phone || 'No phone'}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-300">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{user.city || 'Unknown location'}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-300">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Last login: {formatDateTime(user.last_login)}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                
                {user.occupation && (
                  <div className="text-sm text-gray-300">
                    <span className="font-medium">Occupation:</span> {user.occupation}
                  </div>
                )}
              </div>
              
              {/* Primary Actions Row */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => handleViewUser(user)}
                  className="flex items-center justify-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                
                <button
                  onClick={() => handleEditUser(user.id)}
                  disabled={actionLoading}
                  className="flex items-center justify-center space-x-1 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                
                {user.status === 'active' ? (
                  <button
                    onClick={() => handleSuspendUser(user.id)}
                    disabled={actionLoading}
                    className="flex items-center justify-center space-x-1 bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors text-sm font-medium"
                  >
                    <Ban className="h-4 w-4" />
                    <span>Suspend</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivateUser(user.id)}
                    disabled={actionLoading}
                    className="flex items-center justify-center space-x-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
                  >
                    <Unlock className="h-4 w-4" />
                    <span>Activate</span>
                  </button>
                )}
                
                <button
                  onClick={() => handleResetPassword(user.id)}
                  disabled={actionLoading}
                  className="flex items-center justify-center space-x-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm font-medium"
                >
                  <Key className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>
              
              {/* Secondary Actions Row */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSendEmail(user.id, user.email)}
                  disabled={actionLoading}
                  className="flex items-center justify-center space-x-1 bg-indigo-600 text-white px-2 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </button>
                
                <button
                  onClick={() => handleExportUser(user.id)}
                  disabled={actionLoading}
                  className="flex items-center justify-center space-x-1 bg-gray-600 text-white px-2 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors text-sm font-medium"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
                
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={actionLoading}
                  className="flex items-center justify-center space-x-1 bg-red-600 text-white px-2 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-medium"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">User Details - {selectedUser.name}</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Name</label>
                  <p className="mt-1 text-sm text-white">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <p className="mt-1 text-sm text-white">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Phone</label>
                  <p className="mt-1 text-sm text-white">{selectedUser.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Role</label>
                  <div className="mt-1">{roleBadge(selectedUser.role)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Status</label>
                  <div className="mt-1">{statusBadge(selectedUser.status)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Date of Birth</label>
                  <p className="mt-1 text-sm text-white">{selectedUser.date_of_birth || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Gender</label>
                  <p className="mt-1 text-sm text-white capitalize">{selectedUser.gender || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Occupation</label>
                  <p className="mt-1 text-sm text-white">{selectedUser.occupation || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Company</label>
                  <p className="mt-1 text-sm text-white">{selectedUser.company || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Created</label>
                  <p className="mt-1 text-sm text-white">{formatDateTime(selectedUser.created_at)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Last Login</label>
                  <p className="mt-1 text-sm text-white">{formatDateTime(selectedUser.last_login)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Address</label>
                  <p className="mt-1 text-sm text-white">{selectedUser.address || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">City</label>
                  <p className="mt-1 text-sm text-white">{selectedUser.city || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Country</label>
                  <p className="mt-1 text-sm text-white">{selectedUser.country || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Postal Code</label>
                  <p className="mt-1 text-sm text-white">{selectedUser.postal_code || 'Not provided'}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300">Emergency Contact</label>
                <p className="mt-1 text-sm text-white">{selectedUser.emergency_contact || 'Not provided'}</p>
              </div>
              
              {selectedUser.preferences && (
                <div>
                  <label className="block text-sm font-medium text-gray-300">Preferences</label>
                  <div className="mt-1 text-sm text-white bg-gray-700 p-3 rounded-lg">
                    <div>Language: {selectedUser.preferences.language || 'Not set'}</div>
                    <div>Notifications: {selectedUser.preferences.notifications ? 'Enabled' : 'Disabled'}</div>
                    <div>Newsletter: {selectedUser.preferences.newsletter ? 'Subscribed' : 'Not subscribed'}</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  handleEditUser(selectedUser.id);
                  setShowUserModal(false);
                }}
                disabled={actionLoading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit User</span>
              </button>
              {selectedUser.status === 'active' ? (
                <button
                  onClick={() => {
                    handleSuspendUser(selectedUser.id);
                    setShowUserModal(false);
                  }}
                  disabled={actionLoading}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Ban className="h-4 w-4" />
                  <span>Suspend</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleActivateUser(selectedUser.id);
                    setShowUserModal(false);
                  }}
                  disabled={actionLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Unlock className="h-4 w-4" />
                  <span>Activate</span>
                </button>
              )}
              <button
                onClick={() => handleResetPassword(selectedUser.id)}
                disabled={actionLoading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Key className="h-4 w-4" />
                <span>Reset Password</span>
              </button>
              <button
                onClick={() => handleSendEmail(selectedUser.id, selectedUser.email)}
                disabled={actionLoading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span>Send Email</span>
              </button>
              <button
                onClick={() => handleExportUser(selectedUser.id)}
                disabled={actionLoading}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </button>
            </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AdminUsers;
