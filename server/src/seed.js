const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const Bug = require('./models/Bug');

// MongoDB URI
const MONGO_URI = 'mongodb+srv://basil59mutuku_db_user:cjq6UZRoK2Bg4cYX@plp.ycdlukc.mongodb.net/mernweeksix?retryWrites=true&w=majority&appName=PLP';

// Sample bug data
const sampleBugs = [
  {
    title: 'Login button not responding',
    description: 'Users are unable to click the login button on the homepage. It appears to be a JavaScript error preventing the event handler from firing.',
    status: 'open',
    priority: 'high',
    reporter: 'John Doe'
  },
  {
    title: 'Dashboard loading slowly',
    description: 'The dashboard takes over 10 seconds to load, especially when there are many bugs displayed. Need to optimize database queries.',
    status: 'in-progress',
    priority: 'medium',
    reporter: 'Jane Smith'
  },
  {
    title: 'Mobile layout broken',
    description: 'The bug list does not display properly on mobile devices. The columns are overlapping and text is cut off.',
    status: 'resolved',
    priority: 'low',
    reporter: 'Alice Johnson'
  },
  {
    title: 'Email notifications not sending',
    description: 'When a bug status is updated, email notifications are not being sent to the reporter. SMTP configuration might be incorrect.',
    status: 'open',
    priority: 'high',
    reporter: 'Bob Wilson'
  },
  {
    title: 'Search functionality incomplete',
    description: 'The search bar only searches by title, but users expect to search by description and reporter as well.',
    status: 'in-progress',
    priority: 'medium',
    reporter: 'Charlie Brown'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing bugs (optional, for fresh seeding)
    await Bug.deleteMany({});
    console.log('Cleared existing bugs');

    // Insert sample bugs
    await Bug.insertMany(sampleBugs);
    console.log('Sample bugs inserted successfully');

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
