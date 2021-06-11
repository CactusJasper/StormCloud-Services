let express = require('express');
let router = express.Router();
let Poll = require('../models/poll');
let csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });
let utils = require('../utils');

router.get('/list', (req, res) => {
    if(utils.isAdmin(req.user) || utils.isSuperuser(req.user))
    {
        res.render('polls/list', {
            user: req.user,
            admin: true
        });
    }
    else
    {
        res.render('polls/list', {
            user: req.user
        });
    }
});

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
                        if(utils.isSuperuser(req.user))
                        {
                            res.render('admin/polls/review', {
                                user: req.user,
                                admin: true,
                                poll: poll,
                                csrfToken: req.csrfToken()
                            });
                        }
                        else
                        {
                            res.redirect('back');
                        }
                    }
                    else
                    {
                        if(utils.isAdmin(req.user) || utils.isSuperuser(req.user))
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