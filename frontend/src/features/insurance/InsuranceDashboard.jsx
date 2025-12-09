import { useState, useEffect } from 'react';
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  DollarSign,
  Plus,
  Download
} from 'lucide-react';
import InsuranceKPICard from './InsuranceKPICard';
import InsuranceDataTable from './InsuranceDataTable';
import InsuranceChart from './InsuranceChart';
import InsuranceModal from './InsuranceModal';
import InsuranceForm from './InsuranceForm';
import { InsuranceNotificationContainer, useInsuranceNotifications } from './InsuranceNotification';

const InsuranceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  
  const { notifications, removeNotification, showSuccess, showError } = useInsuranceNotifications();

  // Mock data for demonstration
  const mockData = {
    kpis: {
      totalQuotes: 1247,
      activePolicies: 892,
      totalRevenue: 2450000,
      pendingClaims: 23,
      conversionRate: 71.5,
      monthlyGrowth: 12.3
    },
    charts: {
      monthlyRevenue: [
        { month: 'Jan', revenue: 180000 },
        { month: 'Feb', revenue: 195000 },
        { month: 'Mar', revenue: 210000 },
        { month: 'Apr', revenue: 225000 },
        { month: 'May', revenue: 240000 },
        { month: 'Jun', revenue: 255000 },
        { month: 'Jul', revenue: 270000 },
        { month: 'Aug', revenue: 285000 },
        { month: 'Sep', revenue: 300000 },
        { month: 'Oct', revenue: 315000 },
        { month: 'Nov', revenue: 330000 },
        { month: 'Dec', revenue: 345000 }
      ],
      policyGrowth: [
        { month: 'Jan', policies: 45 },
        { month: 'Feb', policies: 52 },
        { month: 'Mar', policies: 48 },
        { month: 'Apr', policies: 61 },
        { month: 'May', policies: 58 },
        { month: 'Jun', policies: 67 },
        { month: 'Jul', policies: 72 },
        { month: 'Aug', policies: 68 },
        { month: 'Sep', policies: 75 },
        { month: 'Oct', policies: 82 },
        { month: 'Nov', policies: 78 },
        { month: 'Dec', policies: 85 }
      ],
      claimsDistribution: [
        { name: 'Auto', value: 45, color: '#1E40AF' },
        { name: 'Motorcycle', value: 25, color: '#059669' },
        { name: 'Property', value: 20, color: '#D97706' },
        { name: 'Health', value: 10, color: '#DC2626' }
      ]
    },
    tables: {
      recentQuotes: [
        {
          id: 1,
          quote_number: 'QUO-2024-0012',
          customer: 'Ahmed Benali',
          vehicle: 'Toyota Corolla 2020',
          created_at: '2024-01-15',
          status: 'pending',
          premium: 2500
        },
        {
          id: 2,
          quote_number: 'QUO-2024-0011',
          customer: 'Fatima Alami',
          vehicle: 'BMW X3 2021',
          created_at: '2024-01-14',
          status: 'approved',
          premium: 4500
        },
        {
          id: 3,
          quote_number: 'QUO-2024-0010',
          customer: 'Omar Hassan',
          vehicle: 'Mercedes C-Class 2022',
          created_at: '2024-01-13',
          status: 'rejected',
          premium: 3800
        }
      ],
      recentPolicies: [
        {
          id: 1,
          policy_number: 'POL-2024-0008',
          customer: 'Youssef Idrissi',
          effective_date: '2024-01-01',
          premium: 3200,
          status: 'active'
        },
        {
          id: 2,
          policy_number: 'POL-2024-0007',
          customer: 'Aicha Tazi',
          effective_date: '2023-12-15',
          premium: 2800,
          status: 'active'
        }
      ],
      recentClaims: [
        {
          id: 1,
          claim_number: 'CLM-2024-0005',
          customer: 'Hassan El Mansouri',
          type: 'Auto Accident',
          amount: 15000,
          status: 'pending',
          date_filed: '2024-01-10'
        },
        {
          id: 2,
          claim_number: 'CLM-2024-0004',
          customer: 'Nadia Benkirane',
          type: 'Theft',
          amount: 8500,
          status: 'approved',
          date_filed: '2024-01-08'
        }
      ]
    }
  };

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(mockData);
      } catch {
        showError('Error', 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showError]);


  const handleCreateQuote = (formData) => {
    showSuccess('Quote Created', 'New quote has been created successfully');
    setShowQuoteModal(false);
  };

  const handleCreateClaim = (formData) => {
    showSuccess('Claim Filed', 'New claim has been filed successfully');
    setShowClaimModal(false);
  };

  const quoteFormFields = [
    {
      name: 'customerName',
      label: 'Customer Name',
      type: 'text',
      required: true,
      placeholder: 'Enter customer name'
    },
    {
      name: 'vehicleType',
      label: 'Vehicle Type',
      type: 'select',
      required: true,
      options: [
        { value: 'auto', label: 'Auto' },
        { value: 'motorcycle', label: 'Motorcycle' },
        { value: 'truck', label: 'Truck' }
      ]
    },
    {
      name: 'vehicleModel',
      label: 'Vehicle Model',
      type: 'text',
      required: true,
      placeholder: 'Enter vehicle model and year'
    },
    {
      name: 'coverageType',
      label: 'Coverage Type',
      type: 'select',
      required: true,
      options: [
        { value: 'comprehensive', label: 'Comprehensive' },
        { value: 'third_party', label: 'Third Party' },
        { value: 'full_coverage', label: 'Full Coverage' }
      ]
    },
    {
      name: 'premium',
      label: 'Premium Amount (MAD)',
      type: 'text',
      required: true,
      placeholder: 'Enter premium amount'
    }
  ];

  const claimFormFields = [
    {
      name: 'claimType',
      label: 'Claim Type',
      type: 'select',
      required: true,
      options: [
        { value: 'accident', label: 'Accident' },
        { value: 'theft', label: 'Theft' },
        { value: 'damage', label: 'Damage' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      placeholder: 'Describe the incident'
    },
    {
      name: 'amount',
      label: 'Claim Amount (MAD)',
      type: 'text',
      required: true,
      placeholder: 'Enter claim amount'
    },
    {
      name: 'incidentDate',
      label: 'Incident Date',
      type: 'date',
      required: true
    },
    {
      name: 'documents',
      label: 'Supporting Documents',
      type: 'file',
      accept: '.pdf,.jpg,.png',
      helpText: 'Upload photos, police reports, or other supporting documents'
    }
  ];

  if (loading) {
    return (
      <div className="insurance-loading">
        <div className="insurance-loading-spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Insurance Dashboard</h1>
          <p className="text-text-secondary mt-1">Comprehensive insurance management overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="insurance-btn insurance-btn-secondary">
            <Download className="h-4 w-4" />
            Export Report
          </button>
          <button className="insurance-btn insurance-btn-primary">
            <Plus className="h-4 w-4" />
            New Quote
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="insurance-grid insurance-grid-4">
        <InsuranceKPICard
          title="Total Quotes"
          value={data?.kpis.totalQuotes.toLocaleString()}
          change={{ value: 12.5, type: 'increase', period: 'vs last month' }}
          icon={FileText}
          gradient="primary"
          onClick={() => {}}
        />
        <InsuranceKPICard
          title="Active Policies"
          value={data?.kpis.activePolicies.toLocaleString()}
          change={{ value: 8.2, type: 'increase', period: 'vs last month' }}
          icon={Shield}
          gradient="success"
          onClick={() => {}}
        />
        <InsuranceKPICard
          title="Total Revenue"
          value={`${(data?.kpis.totalRevenue / 1000000).toFixed(1)}M MAD`}
          change={{ value: 15.3, type: 'increase', period: 'vs last month' }}
          icon={DollarSign}
          gradient="warning"
          onClick={() => {}}
        />
        <InsuranceKPICard
          title="Pending Claims"
          value={data?.kpis.pendingClaims}
          change={{ value: 3.1, type: 'decrease', period: 'vs last week' }}
          icon={AlertTriangle}
          gradient="danger"
          onClick={() => console.log('Navigate to claims')}
        />
      </div>

      {/* Charts */}
      <div className="insurance-grid insurance-grid-2">
        <InsuranceChart
          title="Monthly Revenue Trend"
          subtitle="Revenue growth over the last 12 months"
          data={data?.charts.monthlyRevenue}
          type="area"
          dataKey="revenue"
          xAxisKey="month"
          yAxisKey="revenue"
          color="#1E40AF"
          trend={{ value: 12.3, period: 'vs last month' }}
          onRefresh={() => {}}
          onExport={() => {}}
        />
        
        <InsuranceChart
          title="Policy Growth"
          subtitle="New policies created each month"
          data={data?.charts.policyGrowth}
          type="line"
          dataKey="policies"
          xAxisKey="month"
          yAxisKey="policies"
          color="#059669"
          trend={{ value: 8.7, period: 'vs last month' }}
          onRefresh={() => {}}
          onExport={() => {}}
        />
      </div>

      {/* Additional Charts */}
      <div className="insurance-grid insurance-grid-2">
        <InsuranceChart
          title="Claims Distribution"
          subtitle="Breakdown by claim type"
          data={data?.charts.claimsDistribution}
          type="pie"
          dataKey="value"
          xAxisKey="name"
          yAxisKey="value"
          colors={['#1E40AF', '#059669', '#D97706', '#DC2626']}
        />
        
        <InsuranceChart
          title="Conversion Rate"
          subtitle="Quote to policy conversion performance"
          data={[{ name: 'Conversion', value: data?.kpis.conversionRate }]}
          type="bar"
          dataKey="value"
          xAxisKey="name"
          yAxisKey="value"
          color="#8B5CF6"
          trend={{ value: 5.2, period: 'vs last month' }}
        />
      </div>

      {/* Data Tables */}
      <div className="insurance-grid insurance-grid-2">
        <InsuranceDataTable
          title="Recent Quotes"
          columns={[
            { header: 'Quote #', accessor: 'quote_number' },
            { header: 'Customer', accessor: 'customer' },
            { header: 'Vehicle', accessor: 'vehicle' },
            { header: 'Created', accessor: 'created_at', type: 'date' },
            { header: 'Status', accessor: 'status', type: 'status' }
          ]}
          data={data?.tables.recentQuotes}
          searchable={true}
          sortable={true}
          actions={[
            {
              icon: <Plus className="h-4 w-4" />,
              label: 'New Quote',
              onClick: () => setShowQuoteModal(true)
            }
          ]}
          onRowClick={(row) => {}}
        />

        <InsuranceDataTable
          title="Recent Policies"
          columns={[
            { header: 'Policy #', accessor: 'policy_number' },
            { header: 'Customer', accessor: 'customer' },
            { header: 'Effective Date', accessor: 'effective_date', type: 'date' },
            { header: 'Premium', accessor: 'premium', type: 'currency' },
            { header: 'Status', accessor: 'status', type: 'status' }
          ]}
          data={data?.tables.recentPolicies}
          searchable={true}
          sortable={true}
        />
      </div>

      {/* Claims Table */}
      <InsuranceDataTable
        title="Recent Claims"
        columns={[
          { header: 'Claim #', accessor: 'claim_number' },
          { header: 'Customer', accessor: 'customer' },
          { header: 'Type', accessor: 'type' },
          { header: 'Amount', accessor: 'amount', type: 'currency' },
          { header: 'Status', accessor: 'status', type: 'status' },
          { header: 'Date Filed', accessor: 'date_filed', type: 'date' }
        ]}
        data={data?.tables.recentClaims}
        searchable={true}
        sortable={true}
        actions={[
          {
            icon: <Plus className="h-4 w-4" />,
            label: 'New Claim',
            onClick: () => setShowClaimModal(true)
          }
        ]}
        onRowClick={(row) => {}}
      />

      {/* Modals */}
      <InsuranceModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        title="Create New Quote"
        subtitle="Fill in the details to create a new insurance quote"
        size="large"
        type="info"
      >
        <InsuranceForm
          title="Quote Information"
          fields={quoteFormFields}
          onSubmit={handleCreateQuote}
          onCancel={() => setShowQuoteModal(false)}
          submitText="Create Quote"
          cancelText="Cancel"
        />
      </InsuranceModal>

      <InsuranceModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        title="File New Claim"
        subtitle="Provide details about the insurance claim"
        size="large"
        type="warning"
      >
        <InsuranceForm
          title="Claim Information"
          fields={claimFormFields}
          onSubmit={handleCreateClaim}
          onCancel={() => setShowClaimModal(false)}
          submitText="File Claim"
          cancelText="Cancel"
        />
      </InsuranceModal>

      {/* Notifications */}
      <InsuranceNotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
        position="top-right"
        maxNotifications={5}
      />
    </div>
  );
};

export default InsuranceDashboard;
