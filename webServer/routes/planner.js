let express = require('express');
let router = express.Router();
let utils = require('../utils');
let ServerEvent = require('../models/server_event');
let csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });

router.get('/', csrfProtection, utils.ensureAuthenticated, (req, res) => {
    
});

router.get('/create/event', csrfProtection, utils.ensureAuthenticated, (req, res) => {
    utils.isAdmin(req.user).then((admin) => {
        if(admin || utils.isWolfy(req.user) || utils.isJasper(req.user))
        {
            res.render('events/create', {
                user: req.user,
                admin: true,
                csrfToken: req.csrfToken(),
            });
        }
        else
        {
            res.render('events/create', {
                user: req.user,
                csrfToken: req.csrfToken(),
            });
        }
    }).catch((err) => {
        res.render('events/create', {
            user: req.user,
            csrfToken: req.csrfToken(),
        });
    });
});

module.exports = router;