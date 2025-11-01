import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import BugList from '../../components/BugList';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('BugList Component - Integration Tests', () => {
  const mockBugs = [
    {
      _id: '1',
      title: 'Test Bug 1',
      description: 'Description 1',
      status: 'open',
      priority: 'high',
      reporter: 'John Doe',
      createdAt: '2023-01-01T00:00:00.000Z'
    },
    {
      _id: '2',
      title: 'Test Bug 2',
      description: 'Description 2',
      status: 'resolved',
      priority: 'low',
      reporter: 'Jane Smith',
      createdAt: '2023-01-02T00:00:00.000Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful API call
    mockedAxios.get.mockResolvedValue({
      data: { bugs: mockBugs, totalPages: 1, currentPage: 1, total: 2 }
    });
  });

  it('fetches and displays bugs on mount', async () => {
    render(<BugList />);

    // Should show loading initially
    expect(screen.getByText('Loading bugs...')).toBeInTheDocument();

    // Wait for bugs to load
    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
      expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
    });

    // Check that API was called
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/bugs', {
      params: {}
    });
  });

  it('displays bug count correctly', async () => {
    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText('2 bugs found')).toBeInTheDocument();
    });
  });

  it('filters bugs by status', async () => {
    // Mock filtered response
    mockedAxios.get.mockResolvedValueOnce({
      data: { bugs: [mockBugs[0]], totalPages: 1, currentPage: 1, total: 1 }
    });

    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    });

    // Change status filter
    const statusFilter = screen.getByLabelText(/status/i);
    fireEvent.change(statusFilter, { target: { value: 'open' } });

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/bugs', {
        params: { status: 'open' }
      });
    });
  });

  it('filters bugs by priority', async () => {
    // Mock filtered response
    mockedAxios.get.mockResolvedValueOnce({
      data: { bugs: [mockBugs[0]], totalPages: 1, currentPage: 1, total: 1 }
    });

    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    });

    // Change priority filter
    const priorityFilter = screen.getByLabelText(/priority/i);
    fireEvent.change(priorityFilter, { target: { value: 'high' } });

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/bugs', {
        params: { priority: 'high' }
      });
    });
  });

  it('shows error message when API fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load bugs. Please try again.')).toBeInTheDocument();
    });

    // Should show try again button
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('shows empty state when no bugs found', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { bugs: [], totalPages: 0, currentPage: 1, total: 0 }
    });

    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText('No bugs found matching your criteria.')).toBeInTheDocument();
    });
  });

  it('retries API call when try again button is clicked', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
    mockedAxios.get.mockResolvedValueOnce({
      data: { bugs: mockBugs, totalPages: 1, currentPage: 1, total: 2 }
    });

    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load bugs. Please try again.')).toBeInTheDocument();
    });

    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(tryAgainButton);

    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    });

    // Should have been called twice (initial + retry)
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  it('displays bug status and priority badges', async () => {
    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    });

    // Check status badges
    expect(screen.getByText('open')).toBeInTheDocument();
    expect(screen.getByText('resolved')).toBeInTheDocument();

    // Check priority badges
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('low')).toBeInTheDocument();
  });

  it('displays reporter and creation date', async () => {
    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText('Reported by: John Doe')).toBeInTheDocument();
      expect(screen.getByText('Reported by: Jane Smith')).toBeInTheDocument();
    });
  });
});
