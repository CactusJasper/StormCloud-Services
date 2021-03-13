let express = require('express');
let router = express.Router();
const passport = require('passport');
let middleware = require('../utils/middleware');

router.get('/discord', middleware.ensureNotAuthenticated, passport.authenticate('discord'));

router.get('/discord/callback', middleware.ensureNotAuthenticated, passport.authenticate('discord', {
    failureRedirect: '/',
    failureMessage: true,
    failureFlash: true
}), (req, res) => {
    res.redirect('/');
});

router.get('/logout', middleware.ensureAuthenticated, (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
});

module.exports = router;