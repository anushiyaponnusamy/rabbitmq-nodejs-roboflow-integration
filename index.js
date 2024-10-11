const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const MongoConnection = require('./mongodbConnection');
const kitchensafetyroute = require('./routes/kitchensafetyroute');
const QueueConsumer = require('./rabbitMqConsumer');

require("dotenv").config({
    path: `./.env`,
  });

const app = express();
              
app.use(bodyParser.json());    
app.use(morgan('dev'));
app.use(helmet());             
const corsOptions = {
    origin: "*", 
    optionsSuccessStatus: 200, 
  };
  app.use(cors(corsOptions)); 
  app.use('/safety',kitchensafetyroute)
app.get('/', (req, res) => {
  res.json({ message: 'Hello, CORS-enabled world!' });
});
MongoConnection.connect();
const PORT = process.env.PORT || 5000;
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!" + err.message);
  });
  (async () => {
    const consumer = new QueueConsumer();
  
    await consumer.connect();
    consumer.consume(); 
  
    // Keep the process running
    process.on('SIGINT', async () => {
      console.log('Gracefully shutting down...');
      await consumer.close();
      process.exit(0);
    });
  })();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
