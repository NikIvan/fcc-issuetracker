'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const models = require('./models');

let app = express();
const {DB_CONNECTION_STRING} = process.env;

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
const port = process.env.PORT || 3000;

async function main() {
  let connection;

  try {
    connection = await mongoose.connect(DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      poolSize: 50,
    });
    console.log('Database connected');

    models.init(connection);
  } catch (err) {
    console.error('Cannot connect to database');
    throw err;
  }

  app.listen(port,  () => {
    console.log(`Listening on port ${port}`);

    if (process.env.NODE_ENV ==='test') {
      console.log('Running Tests...');

      setTimeout(() => {
        try {
          runner.run();
        } catch(e) {
          let error = e;
          console.log('Tests are not valid:');
          console.log(error);
        }
      }, 3500);
    }
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

module.exports = app; //for testing
