const { connect, connection } = require('mongoose');

const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialAppDB';

connect(connectionString); 

connection.on('error', (err) => console.error('MongoDB connection error:', err));

module.exports = connection;
