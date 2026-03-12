import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../app/components/Pagination/Pagination';

describe('Pagination Component', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('should render current page and total pages', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);
    expect(screen.getByText(/Page 1 of 5/)).toBeInTheDocument();
  });

  it('should disable Previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);
    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

  it('should disable Next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />);
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('should call onPageChange when Next is clicked', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />);
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('should call onPageChange when Previous is clicked', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);
    const prevButton = screen.getByText('Previous');
    fireEvent.click(prevButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });
});

