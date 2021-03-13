let express = require('express');
let router = express.Router();
const passport = require('passport');
let utils = require('../utils/middleware');

router.get('/discord', utils.ensureNotAuthenticated, passport.authenticate('discord'));

router.get('/discord/callback', utils.ensureNotAuthenticated, passport.authenticate('discord', {
    failureRedirect: '/',
    failureMessage: true,
    failureFlash: true
}), (req, res) => {
    res.redirect('/');
});

router.get('/logout', utils.ensureAuthenticated, (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
});

module.exports = router;