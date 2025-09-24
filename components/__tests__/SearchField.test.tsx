import { render, screen, fireEvent } from '@testing-library/react';
import SearchField from '../SearchField';

describe('SearchField', () => {
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnSubmit.mockClear();
  });

  it('calls onSubmit when button is clicked', () => {
    render(<SearchField value="" onChange={mockOnChange} onSubmit={mockOnSubmit} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when Enter key is pressed', () => {
    render(<SearchField value="test" onChange={mockOnChange} onSubmit={mockOnSubmit} />);
    
    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls onChange when input value changes', () => {
    render(<SearchField value="" onChange={mockOnChange} onSubmit={mockOnSubmit} />);
    
    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });
});