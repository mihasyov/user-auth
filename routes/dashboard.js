const express = require('express');
const passport = require('passport');
const controller = require('../controllers/dashboard');
const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}) , controller.dashboard);



module.exports = router;