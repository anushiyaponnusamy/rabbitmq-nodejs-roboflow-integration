const mongoose = require('mongoose');

class MongoConnection {
  async connect() {
    try {
      await mongoose.connect( process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connection established successfully.');
    } catch (error) {
      console.error('MongoDB connection error:', error.message);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('MongoDB connection closed.');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error.message);
    }
  }
}

module.exports =new MongoConnection();
