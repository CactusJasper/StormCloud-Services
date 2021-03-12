let express = require('express');
let router = express.Router();
let Poll = require('../models/poll');
let csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });
let utils = require('../utils');

router.get('/view/:pollId', csrfProtection, utils.ensureAuthenticated, (req, res) => {
    if(req.params.pollId !== undefined)
    {
        Poll.findOne({ _id: req.params.pollId }, (err, poll) => {
            if(err)
            {
                res.render('errors/500', { layout: false });
            }
            else
            {
                if(poll)
                {
                    if(poll.state == 0)
                    {
                        
                    }
                    else
                    {
                        utils.isAdmin(req.user).then((admin) => {
                            if(admin || utils.isWolfy(req.user) || utils.isJasper(req.user))
                            {
                                res.render('polls/view', {
                                    user: req.user,
                                    admin: true,
                                    pollId: poll._id,
                                    csrfToken: req.csrfToken()
                                });
                            }
                            else
                            {
                                res.render('polls/view', {
                                    user: req.user,
                                    pollId: poll._id,
                                    csrfToken: req.csrfToken()
                                });
                            }
                        }).catch((err) => {
                            res.render('applications/view', {
                                user: req.user,
                                applicationId: req.params.applicationId,
                                csrfToken: req.csrfToken()
                            });
                        });
                    }
                }
                else
                {
                    res.render('errors/404', { layout: false });
                }
            }
        });
    }
    else
    {
        res.redirect('back');
    }
});

module.exports = router;