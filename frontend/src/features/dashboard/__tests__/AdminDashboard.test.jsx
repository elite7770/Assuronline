import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../AdminDashboard';
import { dashboardAPI } from '../../../shared/services/api';

// Mock the API
jest.mock('../../../shared/services/api', () => ({
  dashboardAPI: {
    getAdminOverview: jest.fn(),
  },
}));

// Mock the UI components
jest.mock('../../../components/ui/KPICard', () => {
  return function MockKPICard({ title, value, loading }) {
    return (
      <div data-testid="kpi-card">
        <h3>{title}</h3>
        <div>{loading ? 'Loading...' : value}</div>
      </div>
    );
  };
});

jest.mock('../../../components/ui/ChartCard', () => {
  return function MockChartCard({ title, children }) {
    return (
      <div data-testid="chart-card">
        <h3>{title}</h3>
        {children}
      </div>
    );
  };
});

jest.mock('../../../components/ui/DataTable', () => {
  return function MockDataTable({ title, rows, loading, emptyMessage }) {
    return (
      <div data-testid="data-table">
        <h3>{title}</h3>
        {loading ? (
          <div>Loading...</div>
        ) : rows.length === 0 ? (
          <div>{emptyMessage}</div>
        ) : (
          <div>Table with {rows.length} rows</div>
        )}
      </div>
    );
  };
});

jest.mock('../../../components/ui/ActivityFeed', () => {
  return function MockActivityFeed({ title, items }) {
    return (
      <div data-testid="activity-feed">
        <h3>{title}</h3>
        <div>Activity items: {items.length}</div>
      </div>
    );
  };
});

const mockDashboardData = {
  policies: {
    total_policies: 150,
    total_paid_amount: 2500000,
  },
  payments: {
    total_paid_amount: 2500000,
  },
  devis: {
    total: 200,
    byStatus: {
      pending: 15,
      approved: 120,
      rejected: 65,
    },
  },
  claims: {
    total: 45,
    byStatus: {
      pending: 8,
      approved: 25,
      rejected: 12,
    },
  },
  charts: {
    monthlyRevenue: [
      { month: '2024-01', revenue: 200000 },
      { month: '2024-02', revenue: 250000 },
      { month: '2024-03', revenue: 300000 },
    ],
  },
  tables: {
    recentDevis: [
      {
        id: 1,
        quote_number: 'QUO-001',
        customer_name: 'John Doe',
        vehicle_model: 'Toyota Camry',
        created_at: '2024-01-15',
        status: 'approved',
      },
    ],
    recentPolicies: [
      {
        id: 1,
        policy_number: 'POL-001',
        customer_name: 'John Doe',
        effective_date: '2024-01-15',
        premium: 2500,
        status: 'active',
      },
    ],
    recentPayments: [
      {
        id: 1,
        payment_id: 'PAY-001',
        customer_name: 'John Doe',
        amount: 2500,
        date: '2024-01-15',
        status: 'paid',
      },
    ],
  },
  activity: [
    {
      actor: 'John Doe',
      action: 'Created quote QUO-001',
      time: '2024-01-15',
      color: 'blue',
    },
  ],
};

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    dashboardAPI.getAdminOverview.mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter(<AdminDashboard />);
    
    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();
  });

  it('renders dashboard with data successfully', async () => {
    dashboardAPI.getAdminOverview.mockResolvedValue({ data: mockDashboardData });
    
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Devis')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
      expect(screen.getByText('Active Policies')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
    });
  });

  it('renders error state when API fails', async () => {
    dashboardAPI.getAdminOverview.mockRejectedValue(new Error('API Error'));
    
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Error Loading Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Failed to load dashboard data. Please try again.')).toBeInTheDocument();
    });
  });

  it('allows retry when error occurs', async () => {
    dashboardAPI.getAdminOverview
      .mockRejectedValueOnce(new Error('API Error'))
      .mockResolvedValueOnce({ data: mockDashboardData });
    
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Try Again'));
    
    await waitFor(() => {
      expect(screen.getByText('Total Devis')).toBeInTheDocument();
    });
  });

  it('displays KPI cards with correct data', async () => {
    dashboardAPI.getAdminOverview.mockResolvedValue({ data: mockDashboardData });
    
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Devis')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
      expect(screen.getByText('Active Policies')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('2.5M MAD')).toBeInTheDocument();
      expect(screen.getByText('Active Claims')).toBeInTheDocument();
      expect(screen.getByText('33')).toBeInTheDocument();
    });
  });

  it('displays data tables with correct information', async () => {
    dashboardAPI.getAdminOverview.mockResolvedValue({ data: mockDashboardData });
    
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Devis')).toBeInTheDocument();
      expect(screen.getByText('Recent Policies')).toBeInTheDocument();
      expect(screen.getByText('Recent Payments')).toBeInTheDocument();
    });
  });

  it('displays activity feed', async () => {
    dashboardAPI.getAdminOverview.mockResolvedValue({ data: mockDashboardData });
    
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });
  });
});
