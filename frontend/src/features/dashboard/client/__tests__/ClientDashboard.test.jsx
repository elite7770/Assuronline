import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ClientDashboard from '../ClientDashboard';
import { dashboardAPI } from '../../../shared/services/api';

// Mock the API
jest.mock('../../../shared/services/api', () => ({
  dashboardAPI: {
    getClientData: jest.fn(),
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

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockClientData = {
  kpis: {
    activePolicies: 3,
    pendingDevis: 1,
    totalPaid: 7500,
    activeClaims: 2,
  },
  charts: {
    paymentHistory: [
      { month: '2024-01', amount: 2500 },
      { month: '2024-02', amount: 2500 },
      { month: '2024-03', amount: 2500 },
    ],
  },
  lists: {
    recentPolicies: [
      {
        id: 1,
        policy_number: 'POL-001',
        start_date: '2024-01-15',
        premium: 2500,
        status: 'active',
      },
    ],
    recentPayments: [
      {
        id: 1,
        payment_id: 'PAY-001',
        amount: 2500,
        paid_at: '2024-01-15',
        status: 'paid',
      },
    ],
    recentClaims: [
      {
        id: 1,
        claim_number: 'CLM-001',
        type: 'Accident',
        created_at: '2024-01-15',
        status: 'pending',
      },
    ],
  },
  activity: [
    {
      actor: 'You',
      action: 'Created policy POL-001',
      time: '2024-01-15',
      color: 'green',
    },
  ],
};

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ClientDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    dashboardAPI.getClientData.mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter(<ClientDashboard />);
    
    expect(screen.getByText('Loading your dashboard...')).toBeInTheDocument();
  });

  it('renders dashboard with data successfully', async () => {
    dashboardAPI.getClientData.mockResolvedValue({ data: mockClientData });
    
    renderWithRouter(<ClientDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Active Policies')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Pending Devis')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it('renders error state when API fails', async () => {
    dashboardAPI.getClientData.mockRejectedValue(new Error('API Error'));
    
    renderWithRouter(<ClientDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Error Loading Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Failed to load your dashboard data. Please try again.')).toBeInTheDocument();
    });
  });

  it('allows retry when error occurs', async () => {
    dashboardAPI.getClientData
      .mockRejectedValueOnce(new Error('API Error'))
      .mockResolvedValueOnce({ data: mockClientData });
    
    renderWithRouter(<ClientDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Try Again'));
    
    await waitFor(() => {
      expect(screen.getByText('Active Policies')).toBeInTheDocument();
    });
  });

  it('displays KPI cards with correct data', async () => {
    dashboardAPI.getClientData.mockResolvedValue({ data: mockClientData });
    
    renderWithRouter(<ClientDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Active Policies')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Devis en Attente')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('Total Paid')).toBeInTheDocument();
      expect(screen.getByText('7.500 MAD')).toBeInTheDocument();
      expect(screen.getByText('Active Claims')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('displays quick actions section', async () => {
    dashboardAPI.getClientData.mockResolvedValue({ data: mockClientData });
    
    renderWithRouter(<ClientDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Nouveau Devis')).toBeInTheDocument();
      expect(screen.getByText('File a Claim')).toBeInTheDocument();
      expect(screen.getByText('Make Payment')).toBeInTheDocument();
    });
  });

  it('displays data tables with correct information', async () => {
    dashboardAPI.getClientData.mockResolvedValue({ data: mockClientData });
    
    renderWithRouter(<ClientDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('My Policies')).toBeInTheDocument();
      expect(screen.getByText('Recent Claims')).toBeInTheDocument();
      expect(screen.getByText('Policy Documents')).toBeInTheDocument();
    });
  });

  it('displays payment history chart', async () => {
    dashboardAPI.getClientData.mockResolvedValue({ data: mockClientData });
    
    renderWithRouter(<ClientDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Financial Health Score')).toBeInTheDocument();
    });
  });

  it('displays activity feed', async () => {
    dashboardAPI.getClientData.mockResolvedValue({ data: mockClientData });
    
    renderWithRouter(<ClientDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Your Recent Activity')).toBeInTheDocument();
    });
  });
});
