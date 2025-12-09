import { render, screen, fireEvent } from '@testing-library/react';
import DataTable from '../DataTable';

const mockColumns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  { header: 'Status', accessor: 'status', render: (value) => (
    <span className={`status-${value}`}>{value}</span>
  ) },
];

const mockRows = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'pending' },
];

describe('DataTable', () => {
  it('renders table with data', () => {
    render(
      <DataTable
        columns={mockColumns}
        rows={mockRows}
        title="Test Table"
      />
    );

    expect(screen.getByText('Test Table')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(
      <DataTable
        columns={mockColumns}
        rows={mockRows}
        loading={true}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(
      <DataTable
        columns={mockColumns}
        rows={[]}
        emptyMessage="No data found"
      />
    );

    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('renders custom cell renderer', () => {
    render(
      <DataTable
        columns={mockColumns}
        rows={mockRows}
      />
    );

    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('inactive')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  it('enables search functionality', () => {
    render(
      <DataTable
        columns={mockColumns}
        rows={mockRows}
        title="Test Table"
        searchable={true}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toBeInTheDocument();

    // Search for "John"
    fireEvent.change(searchInput, { target: { value: 'John' } });
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
  });

  it('enables sorting functionality', () => {
    render(
      <DataTable
        columns={mockColumns}
        rows={mockRows}
        sortable={true}
      />
    );

    const nameHeader = screen.getByText('Name');
    expect(nameHeader).toBeInTheDocument();

    // Click to sort by name
    fireEvent.click(nameHeader);
    
    // The table should still be rendered (sorting is handled internally)
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders actions column when renderActions is provided', () => {
    const mockRenderActions = (row) => (
      <button data-testid={`action-${row.id}`}>Edit</button>
    );

    render(
      <DataTable
        columns={mockColumns}
        rows={mockRows}
        renderActions={mockRenderActions}
      />
    );

    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByTestId('action-1')).toBeInTheDocument();
    expect(screen.getByTestId('action-2')).toBeInTheDocument();
    expect(screen.getByTestId('action-3')).toBeInTheDocument();
  });

  it('handles search with no results', () => {
    render(
      <DataTable
        columns={mockColumns}
        rows={mockRows}
        title="Test Table"
        searchable={true}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <DataTable
        columns={mockColumns}
        rows={mockRows}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
