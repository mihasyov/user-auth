const express = require('express');

const mongoose =  require('mongoose');
const passport = require('passport');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const keys = require('./config/keys')

const app = express();

mongoose.connect(keys.mongoURI)
    .then(() => console.log('mongoDB connected'))
    .catch(e => console.log(e));

app.use(passport.initialize());
require('./middleware/passport')(passport);
app.use(require('morgan')('dev'));

app.use(require('cors')());
app.use(express.urlencoded({extended: true}));
app.use(express.json());



app.use('/api/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

module.exports = app;