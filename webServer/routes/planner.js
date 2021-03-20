let express = require('express');
let router = express.Router();
let utils = require('../utils');
let ServerEvent = require('../models/server_event');
let csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });

router.get('/', csrfProtection, utils.ensureAuthenticated, (req, res) => {
    utils.isAdmin(req.user).then((admin) => {
        if(admin || utils.isWolfy(req.user) || utils.isJasper(req.user))
        {
            res.render('events/planner', {
                user: req.user,
                admin: true,
                csrfToken: req.csrfToken(),
            });
        }
        else
        {
            res.render('events/planner', {
                user: req.user,
                csrfToken: req.csrfToken(),
            });
        }
    }).catch((err) => {
        res.render('events/planner', {
            user: req.user,
            csrfToken: req.csrfToken(),
        });
    });
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

router.post('/create/event', csrfProtection, utils.ensureAuthenticated, [
    check('eventTitle').notEmpty().withMessage('Please provide an title for the event.'),
    check('eventTitle').isLength({ max: 32 }).withMessage('An events name can be a maximum of 32 chracters.'),
    check('eventDesc').notEmpty().withMessage('Please provide an event description.'),
    check('eventDesc').isLength({ max: 500 }).withMessage('An events description can be a maximum of 500 chracters.')
], (req, res) => {

});


module.exports = router;