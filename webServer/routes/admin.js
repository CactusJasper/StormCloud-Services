let express = require('express');
let router = express.Router();
let utils = require('../utils');
const { check, validationResult, expressValidator } = require('express-validator');
let csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });

router.get('/', utils.ensureAuthenticated, (req, res) => {
    utils.isAdmin(req.user).then((admin) => {
        if(utils.isWolfy(req.user) || utils.isJasper(req.user))
        {
            res.render('admin/dashboard', {
                admin: true,
                superUser: true,
                user: req.user
            });
        }
        else if(admin)
        {
            res.render('admin/dashboard', {
                admin: true,
                superUser: false,
                user: req.user
            });
        }
        else
        {
            res.redirect('back');
        }
    });
});

module.exports = router;