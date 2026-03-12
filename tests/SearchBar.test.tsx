import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchBar from '../app/components/SearchBar/SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render search input', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search products...');
    expect(input).toBeInTheDocument();
  });

  it('should call onSearch after debounce delay when user types', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search products...');

    fireEvent.change(input, { target: { value: 'test' } });
    // onSearch should not be called immediately
    expect(mockOnSearch).not.toHaveBeenCalledWith('test');

    // Advance timers past the 400ms debounce
    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  it('should update input value on change', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search products...') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'laptop' } });
    expect(input.value).toBe('laptop');
  });
});

