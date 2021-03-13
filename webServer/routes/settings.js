let express = require('express');
let router = express.Router();
let utils = require('../utils');
let User = require('../models/user');
let csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });

router.get('/', csrfProtection, utils.ensureAuthenticated, (req, res) => {
    utils.isAdmin(req.user).then((admin) => {
        if(admin || utils.isWolfy(req.user) || utils.isJasper(req.user))
        {
            res.render('settings', {
                user: req.user,
                admin: true,
                csrfToken: req.csrfToken(),
                helpers: {
                    setChecked: (value, currentValue) => { return utils.setChecked(value, currentValue) }
                }
            });
        }
        else
        {
            res.render('settings', {
                user: req.user,
                csrfToken: req.csrfToken(),
                helpers: {
                    setChecked: (value, currentValue) => { return utils.setChecked(value, currentValue) }
                }
            });
        }
    }).catch((err) => {
        res.render('settings', {
            user: req.user,
            csrfToken: req.csrfToken(),
            helpers: {
                setChecked: (value, currentValue) => { return utils.setChecked(value, currentValue) }
            }
        });
    });
});

router.post('/change', csrfProtection, utils.ensureAuthenticated, (req, res) => {
    req.user.theme = req.body.theme;
    req.user.save((err) => {
        if(err)
        {
            req.session.sessionFlash = {
                type: 'error',
                message: "Something went wrong check back later."
            }
        }
        else
        {
            req.session.sessionFlash = {
                type: 'success',
                message: "Successfuly Changed Settings"
            }
        }
        
        res.redirect('back');
    });
});

module.exports = router;