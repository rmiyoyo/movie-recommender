import { render, screen } from '@testing-library/react';
import Header from '../Header';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react');

describe('Header', () => {
  it('renders navigation links', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    
    render(<Header />);
    
    expect(screen.getByText('MovieRecom')).toBeInTheDocument();
    expect(screen.getByLabelText('home')).toBeInTheDocument();
    expect(screen.getByLabelText('search')).toBeInTheDocument();
    expect(screen.getByLabelText('bookmark')).toBeInTheDocument();
    expect(screen.getByLabelText('user')).toBeInTheDocument();
  });
});