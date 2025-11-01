import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import BugForm from '../../components/BugForm';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('BugForm Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with all required fields', () => {
    render(<BugForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/title \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reporter name \*/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /report bug/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /report bug/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.getByText('Reporter name is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for title too long', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title \*/i);
    const longTitle = 'a'.repeat(101);
    fireEvent.change(titleInput, { target: { value: longTitle } });

    const submitButton = screen.getByRole('button', { name: /report bug/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title must be less than 100 characters')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for description too long', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);

    const descriptionInput = screen.getByLabelText(/description \*/i);
    const longDescription = 'a'.repeat(1001);
    fireEvent.change(descriptionInput, { target: { value: longDescription } });

    const submitButton = screen.getByRole('button', { name: /report bug/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Description must be less than 1000 characters')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title \*/i);
    const descriptionInput = screen.getByLabelText(/description \*/i);
    const reporterInput = screen.getByLabelText(/reporter name \*/i);
    const submitButton = screen.getByRole('button', { name: /report bug/i });

    fireEvent.change(titleInput, { target: { value: 'Test Bug' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    fireEvent.change(reporterInput, { target: { value: 'John Doe' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Bug',
        description: 'Test description',
        priority: 'medium',
        reporter: 'John Doe'
      });
    });
  });

  it('clears form after successful submission', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title \*/i);
    const descriptionInput = screen.getByLabelText(/description \*/i);
    const reporterInput = screen.getByLabelText(/reporter name \*/i);

    fireEvent.change(titleInput, { target: { value: 'Test Bug' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    fireEvent.change(reporterInput, { target: { value: 'John Doe' } });

    const submitButton = screen.getByRole('button', { name: /report bug/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    expect(titleInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
    expect(reporterInput.value).toBe('');
  });

  it('shows loading state during submission', () => {
    render(<BugForm onSubmit={mockOnSubmit} loading={true} />);

    const submitButton = screen.getByRole('button', { name: /reporting bug\.\.\./i });
    expect(submitButton).toBeDisabled();

    // Form inputs should be disabled
    const titleInput = screen.getByLabelText(/title \*/i);
    expect(titleInput).toBeDisabled();
  });

  it('clears validation errors when user starts typing', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /report bug/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText(/title \*/i);
    fireEvent.change(titleInput, { target: { value: 'a' } });

    await waitFor(() => {
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    });
  });
});
