import React, { useState } from 'react';
import axios from 'axios';
import BugForm from './components/BugForm';
import BugList from './components/BugList';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBugSubmit = async (bugData) => {
    try {
      console.log('Submitting bug to server:', bugData); // Debugging log
      await axios.post('http://localhost:5000/api/bugs', bugData);
      // Trigger refresh of bug list
      setRefreshTrigger(prev => prev + 1);
      alert('Bug reported successfully!');
    } catch (error) {
      console.error('Error submitting bug:', error); // Debugging log
      alert('Failed to report bug. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bug Tracker</h1>
          <p className="text-gray-600">Report and manage bugs efficiently</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <BugForm onSubmit={handleBugSubmit} />
          </div>
          <div>
            <BugList key={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
