import React, { useState } from 'react';
import axios from 'axios';
import Button from './Button';

const BugItem = ({ bug, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: bug.title,
    description: bug.description,
    status: bug.status,
    priority: bug.priority
  });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      title: bug.title,
      description: bug.description,
      status: bug.status,
      priority: bug.priority
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log('Updating bug:', bug._id, editData); // Debugging log

      const response = await axios.put(`http://localhost:5000/api/bugs/${bug._id}`, editData);
      onUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating bug:', error); // Debugging log
      alert('Failed to update bug. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this bug?')) {
      return;
    }

    try {
      setLoading(true);
      console.log('Deleting bug:', bug._id); // Debugging log

      await axios.delete(`http://localhost:5000/api/bugs/${bug._id}`);
      onDelete(bug._id);
    } catch (error) {
      console.error('Error deleting bug:', error); // Debugging log
      alert('Failed to delete bug. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editData.status}
                onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={editData.priority}
                onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading} size="sm">
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={handleCancel} variant="secondary" disabled={loading} size="sm">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{bug.title}</h3>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bug.status)}`}>
                {bug.status.replace('-', ' ')}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(bug.priority)}`}>
                {bug.priority}
              </span>
            </div>
          </div>

          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{bug.description}</p>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Reported by: {bug.reporter}</span>
            <span>{new Date(bug.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleEdit} variant="secondary" size="sm">
              Edit
            </Button>
            <Button onClick={handleDelete} variant="danger" size="sm">
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BugItem;
