// require the libraries
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// require controllers & routers
const searchRouter = require('./routers/searchRouter');
const authController = require('./controllers/authController');
const authRouter = require('./routers/authRouter');
const flightController = require('./routers/flightController');

// GLOCAL OBJECTS
// init the env variables
dotenv.config();

// init the database
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log('[LOG] DB CONNECTED SUCCESSFULY');
  })
  .catch((err) => {
    console.log('[ERR] ERR WHILE CONNECTED TO THE DB\n', err);
  });

// init the app
const PORT = process.env.PORT || 8000;
const app = express();

// init the middlewares
app.use(express.json());
app.use(cors());

// add routes&controllers
app.use(authController);
app.use(authRouter);
app.use(searchRouter);
app.use('/flight', flightController);

// start the server
app.listen(PORT, () => {
  console.log(`[LOG] app is up and running at http://localhost:${PORT}`);
});
