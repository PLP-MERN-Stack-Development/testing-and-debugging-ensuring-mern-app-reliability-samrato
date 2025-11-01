import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BugItem from './BugItem';
import Button from './Button';

const BugList = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });

  const fetchBugs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;

      console.log('Fetching bugs with filters:', params); // Debugging log

      const response = await axios.get('http://localhost:5000/api/bugs', { params });
      setBugs(response.data.bugs || []);
    } catch (err) {
      console.error('Error fetching bugs:', err); // Debugging log
      setError('Failed to load bugs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, [filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleBugUpdate = (updatedBug) => {
    setBugs(prev => prev.map(bug =>
      bug._id === updatedBug._id ? updatedBug : bug
    ));
  };

  const handleBugDelete = (deletedId) => {
    setBugs(prev => prev.filter(bug => bug._id !== deletedId));
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading bugs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-800">{error}</p>
        <Button
          onClick={fetchBugs}
          variant="secondary"
          size="sm"
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Bug Reports</h2>

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority-filter"
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Bug count */}
        <p className="text-gray-600 mb-4">
          {bugs.length} bug{bugs.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Bug list */}
      {bugs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No bugs found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bugs.map(bug => (
            <BugItem
              key={bug._id}
              bug={bug}
              onUpdate={handleBugUpdate}
              onDelete={handleBugDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BugList;
