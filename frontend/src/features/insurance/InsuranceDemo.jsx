import { useState } from 'react';
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  DollarSign,
  Plus,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle as Warning
} from 'lucide-react';
import InsuranceKPICard from './InsuranceKPICard';
import InsuranceDataTable from './InsuranceDataTable';
import InsuranceChart from './InsuranceChart';
import InsuranceModal from './InsuranceModal';
import InsuranceForm from './InsuranceForm';
import { InsuranceNotificationContainer, useInsuranceNotifications } from './InsuranceNotification';

const InsuranceDemo = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('default');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('quote');
  
  const { notifications, removeNotification, showSuccess, showWarning, showError, showInfo } = useInsuranceNotifications();

  // Demo data
  const demoData = {
    kpis: [
      {
        title: "Total Quotes",
        value: "1,247",
        change: { value: 12.5, type: 'increase', period: 'vs last month' },
        icon: FileText,
        gradient: 'primary'
      },
      {
        title: "Active Policies",
        value: "892",
        change: { value: 8.2, type: 'increase', period: 'vs last month' },
        icon: Shield,
        gradient: 'success'
      },
      {
        title: "Total Revenue",
        value: "2.45M MAD",
        change: { value: 15.3, type: 'increase', period: 'vs last month' },
        icon: DollarSign,
        gradient: 'warning'
      },
      {
        title: "Pending Claims",
        value: "23",
        change: { value: 3.1, type: 'decrease', period: 'vs last week' },
        icon: AlertTriangle,
        gradient: 'danger'
      }
    ],
    charts: {
      revenue: [
        { month: 'Jan', revenue: 180000 },
        { month: 'Feb', revenue: 195000 },
        { month: 'Mar', revenue: 210000 },
        { month: 'Apr', revenue: 225000 },
        { month: 'May', revenue: 240000 },
        { month: 'Jun', revenue: 255000 }
      ],
      policies: [
        { month: 'Jan', policies: 45 },
        { month: 'Feb', policies: 52 },
        { month: 'Mar', policies: 48 },
        { month: 'Apr', policies: 61 },
        { month: 'May', policies: 58 },
        { month: 'Jun', policies: 67 }
      ],
      claims: [
        { name: 'Auto', value: 45, color: '#1E40AF' },
        { name: 'Motorcycle', value: 25, color: '#059669' },
        { name: 'Property', value: 20, color: '#D97706' },
        { name: 'Health', value: 10, color: '#DC2626' }
      ]
    },
    tables: {
      quotes: [
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
      policies: [
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
      ]
    }
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

  const handleShowModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleShowForm = (type) => {
    setFormType(type);
    setShowForm(true);
  };

  const handleFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
    showSuccess('Success', `${formType} form submitted successfully`);
    setShowForm(false);
  };

  const handleNotificationDemo = (type) => {
    switch (type) {
      case 'success':
        showSuccess('Quote Approved', 'Quote QUO-2024-0012 has been approved successfully');
        break;
      case 'warning':
        showWarning('Policy Expiring', 'Policy POL-2024-0003 expires in 7 days');
        break;
      case 'error':
        showError('Payment Failed', 'Payment for Policy POL-2024-0005 failed to process');
        break;
      case 'info':
        showInfo('New Claim Filed', 'A new claim has been filed for Policy POL-2024-0008');
        break;
      default:
        showInfo('Notification', 'This is a default notification');
        break;
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text-primary mb-4">Insurance Dashboard Components</h1>
        <p className="text-lg text-text-secondary">Professional insurance management system with unified theme</p>
      </div>

      {/* KPI Cards Demo */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">KPI Cards</h2>
        <div className="insurance-grid insurance-grid-4">
          {demoData.kpis.map((kpi, index) => (
            <InsuranceKPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              icon={kpi.icon}
              gradient={kpi.gradient}
              onClick={() => console.log(`Clicked ${kpi.title}`)}
            />
          ))}
        </div>
      </section>

      {/* Charts Demo */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Analytics Charts</h2>
        <div className="insurance-grid insurance-grid-2">
          <InsuranceChart
            title="Monthly Revenue Trend"
            subtitle="Revenue growth over time"
            data={demoData.charts.revenue}
            type="area"
            dataKey="revenue"
            xAxisKey="month"
            yAxisKey="revenue"
            color="#1E40AF"
            trend={{ value: 12.3, period: 'vs last month' }}
            onRefresh={() => console.log('Refresh revenue data')}
            onExport={() => console.log('Export revenue chart')}
          />
          
          <InsuranceChart
            title="Policy Growth"
            subtitle="New policies created each month"
            data={demoData.charts.policies}
            type="line"
            dataKey="policies"
            xAxisKey="month"
            yAxisKey="policies"
            color="#059669"
            trend={{ value: 8.7, period: 'vs last month' }}
            onRefresh={() => console.log('Refresh policy data')}
            onExport={() => console.log('Export policy chart')}
          />
        </div>
        
        <div className="insurance-grid insurance-grid-2">
          <InsuranceChart
            title="Claims Distribution"
            subtitle="Breakdown by claim type"
            data={demoData.charts.claims}
            type="pie"
            dataKey="value"
            xAxisKey="name"
            yAxisKey="value"
            colors={['#1E40AF', '#059669', '#D97706', '#DC2626']}
          />
          
          <InsuranceChart
            title="Conversion Rate"
            subtitle="Quote to policy conversion"
            data={[{ name: 'Conversion', value: 71.5 }]}
            type="bar"
            dataKey="value"
            xAxisKey="name"
            yAxisKey="value"
            color="#8B5CF6"
            trend={{ value: 5.2, period: 'vs last month' }}
          />
        </div>
      </section>

      {/* Data Tables Demo */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Data Tables</h2>
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
            data={demoData.tables.quotes}
            searchable={true}
            sortable={true}
            actions={[
              {
                icon: <Plus className="h-4 w-4" />,
                label: 'New Quote',
                onClick: () => handleShowForm('quote')
              }
            ]}
            onRowClick={(row) => console.log('View quote:', row)}
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
            data={demoData.tables.policies}
            searchable={true}
            sortable={true}
            actions={[
              {
                icon: <Plus className="h-4 w-4" />,
                label: 'New Policy',
                onClick: () => handleShowForm('policy')
              }
            ]}
            onRowClick={(row) => console.log('View policy:', row)}
          />
        </div>
      </section>

      {/* Forms Demo */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Forms & Modals</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleShowForm('quote')}
            className="insurance-btn insurance-btn-primary"
          >
            <Plus className="h-4 w-4" />
            Create Quote Form
          </button>
          <button
            onClick={() => handleShowForm('claim')}
            className="insurance-btn insurance-btn-secondary"
          >
            <AlertTriangle className="h-4 w-4" />
            File Claim Form
          </button>
          <button
            onClick={() => handleShowModal('success')}
            className="insurance-btn insurance-btn-success"
          >
            <CheckCircle className="h-4 w-4" />
            Success Modal
          </button>
          <button
            onClick={() => handleShowModal('warning')}
            className="insurance-btn insurance-btn-danger"
          >
            <Warning className="h-4 w-4" />
            Warning Modal
          </button>
        </div>
      </section>

      {/* Notifications Demo */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Notifications</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleNotificationDemo('success')}
            className="insurance-btn insurance-btn-success"
          >
            <CheckCircle className="h-4 w-4" />
            Success Notification
          </button>
          <button
            onClick={() => handleNotificationDemo('warning')}
            className="insurance-btn insurance-btn-secondary"
          >
            <Warning className="h-4 w-4" />
            Warning Notification
          </button>
          <button
            onClick={() => handleNotificationDemo('error')}
            className="insurance-btn insurance-btn-danger"
          >
            <AlertCircle className="h-4 w-4" />
            Error Notification
          </button>
          <button
            onClick={() => handleNotificationDemo('info')}
            className="insurance-btn insurance-btn-primary"
          >
            <Info className="h-4 w-4" />
            Info Notification
          </button>
        </div>
      </section>

      {/* Color Palette Demo */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-text-primary">Primary</h3>
            <div className="space-y-1">
              <div className="h-8 bg-primary-500 rounded"></div>
              <div className="h-6 bg-primary-100 rounded"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-text-primary">Success</h3>
            <div className="space-y-1">
              <div className="h-8 bg-success-500 rounded"></div>
              <div className="h-6 bg-success-100 rounded"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-text-primary">Warning</h3>
            <div className="space-y-1">
              <div className="h-8 bg-warning-500 rounded"></div>
              <div className="h-6 bg-warning-100 rounded"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-text-primary">Danger</h3>
            <div className="space-y-1">
              <div className="h-8 bg-danger-500 rounded"></div>
              <div className="h-6 bg-danger-100 rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <InsuranceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} Modal`}
        subtitle="This is a demo modal with different types"
        type={modalType}
        size="medium"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            This is a {modalType} modal demonstrating the insurance theme styling.
          </p>
          <div className="flex gap-3">
            <button className="insurance-btn insurance-btn-primary">Primary Action</button>
            <button className="insurance-btn insurance-btn-secondary">Secondary Action</button>
          </div>
        </div>
      </InsuranceModal>

      <InsuranceModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={`Create ${formType.charAt(0).toUpperCase() + formType.slice(1)}`}
        subtitle={`Fill in the details to create a new ${formType}`}
        size="large"
        type="info"
      >
        <InsuranceForm
          title={`${formType.charAt(0).toUpperCase() + formType.slice(1)} Information`}
          fields={formType === 'quote' ? quoteFormFields : claimFormFields}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          submitText={`Create ${formType.charAt(0).toUpperCase() + formType.slice(1)}`}
          cancelText="Cancel"
        />
      </InsuranceModal>

      {/* Notifications Container */}
      <InsuranceNotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
        position="top-right"
        maxNotifications={5}
      />
    </div>
  );
};

export default InsuranceDemo;
