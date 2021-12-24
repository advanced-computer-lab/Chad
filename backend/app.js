// require the libraries
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// require controllers & routers
const searchRouter = require('./routers/searchRouter');
const authController = require('./controllers/authController');
const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const flightRouter = require('./routers/flightRouter');
const placeRouter = require('./routers/placeRouter');
const ticketRouter = require('./routers/ticketRouter');
const reservationRouter = require('./routers/reservationRouter');
const forgetPasswordRouter=require('./routers/forgetPasswordRouter')
// GLOCAL OBJECTS
const { log } = console;

// init the env variables
dotenv.config();

// init the database
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    log('[LOG] DB CONNECTED SUCCESSFULY');
  })
  .catch((err) => {
    log('[ERR] ERR WHILE CONNECTED TO THE DB\n', err);
  });

// init the app
const PORT = process.env.PORT || 8000;
const app = express();

// init the middlewares
app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  })
);

// add routes&controllers
app.use(authController);
app.use(authRouter);
app.use(forgetPasswordRouter);
app.use(searchRouter);
app.use(userRouter);
app.use(placeRouter);
app.use(flightRouter);
app.use(reservationRouter);
app.use(ticketRouter);

// start the server
app.listen(PORT, () => {
  log(`[LOG] app is up and running at http://localhost:${PORT}`);
});
module.exports = app;
