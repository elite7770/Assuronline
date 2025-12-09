import { render, screen } from '@testing-library/react';
import KPICard from '../KPICard';

describe('KPICard', () => {
  it('renders title and value', () => {
    render(<KPICard title="Active Policies" value={5} icon={() => null} gradient="success" />);
    expect(screen.getByText('Active Policies')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});


