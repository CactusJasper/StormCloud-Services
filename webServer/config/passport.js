const User = require('../models/user');
const discord = require('./passport/discord');
const refresh = require('passport-oauth2-refresh');

module.exports = (passport) => {
    // Discord Stratergy
    passport.use(discord);
    refresh.use(discord);

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}