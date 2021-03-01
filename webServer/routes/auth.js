let express = require('express');
let router = express.Router();
const passport = require('passport');
let utils = require('../utils');

router.get('/discord', utils.ensureNotAuthenticated, passport.authenticate('discord'));

router.get('/discord/callback', utils.ensureNotAuthenticated, passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/');
});

router.get('/logout', utils.ensureAuthenticated, (req, res) => {
    req.logout();

    // Adds a Flash Message
    req.session.sessionFlash = {
        type: 'success',
        message: "Successfuly logged out"
    }
    res.redirect('/');
});

module.exports = router;