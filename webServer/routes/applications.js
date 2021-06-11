let express = require('express');
let router = express.Router();
let utils = require('../utils');
const { check, validationResult, expressValidator } = require('express-validator');
let csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });
let Application = require('../models/application');

router.get('/view/:applicationId', csrfProtection, utils.ensureAuthenticated, (req, res) => {
    if(req.params.applicationId !== undefined)
    {
        if(utils.isAdmin(req.user) || utils.isSuperuser(req.user))
        {
            res.render('applications/view', {
                user: req.user,
                admin: true,
                applicationId: req.params.applicationId,
                csrfToken: req.csrfToken()
            });
        }
        else
        {
            res.render('applications/view', {
                user: req.user,
                applicationId: req.params.applicationId,
                csrfToken: req.csrfToken()
            });
        }
    }
    else
    {
        res.redirect('back');
    }
});

router.get('/create', csrfProtection, utils.ensureAuthenticated, (req, res) => {
    if(utils.isAdmin(req.user) || utils.isSuperuser(req.user))
    {
        res.redirect('/');
    }
    else
    {
        utils.canCreateApplication(req.user.discordId).then((response) => {
            if(response.status == 500)
            {
                // Adds a Flash Message
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Something went wrong please try again later'
                }

                res.redirect('/');
            }
            else
            {
                if(response.canCreate == true)
                {
                    res.render('applications/create', {
                        user: req.user,
                        admin: true,
                        csrfToken: req.csrfToken()
                    });
                }
                else
                {
                    // Adds a Flash Message
                    req.session.sessionFlash = {
                        type: 'error',
                        message: 'You have already created an application within the last month'
                    }

                    res.redirect('/');
                }
            }
        }).catch((err) => {
            // Adds a Flash Message
            req.session.sessionFlash = {
                type: 'error',
                message: 'Something went wrong please try again later'
            }

            res.redirect('/');
        });
    }
});

router.post('/create', csrfProtection, utils.ensureAuthenticated, [
    check('q1').notEmpty().withMessage('Please fill out question 1.'),
    check('q2').notEmpty().withMessage('Please fill out question 2.'),
    check('q2').isLength({ max: 250 }).withMessage('Please use a maximum of 250 characters to answer question 2.'),
    check('q3').notEmpty().withMessage('Please fill out question 3.'),
    check('q4').notEmpty().withMessage('Please fill out question 4.'),
    check('q5').notEmpty().withMessage('Please fill out question 5.'),
    check('q6').isLength({ max: 250 }).withMessage('Please use a maximum of 250 characters to answer question 2.'),
    check('q7').isLength({ max: 500 }).withMessage('Please use a maximum of 250 characters to answer question 2.')
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        let msg = `<ul class="list-group" style="list-style-type: none;">`;
        for(let i = 0; i < errors.array().length; i++)
        {
            msg += `<li> > ${errors.array()[i].msg}</li>`;
        }
        msg += '</ul>';

        // Adds a Flash Message
        req.session.sessionFlash = {
            type: 'error',
            message: msg
        }

        if(req.body.q2 !== '')
        {
            req.session.sessionFlash.q2 = req.body.q2;
        }

        if(req.body.q6 !== '')
        {
            req.session.sessionFlash.q6 = req.body.q6;
        }

        if(req.body.q7 !== '')
        {
            req.session.sessionFlash.q7 = req.body.q7;
        }

        res.redirect('back');
    }
    else if(utils.isAdmin(req.user) || utils.isSuperuser(req.user))
    {
        res.redirect('/');
    }
    else
    {
        let q1 = req.body.q1;
        let q2 = req.body.q2;
        let q3 = utils.convertToTextApplications(req.body.q3);
        let q4 = utils.convertToTextApplications(req.body.q4);
        let q5 = req.body.q5;
        let q6;
        let q7;

        if(req.body.q6 !== '')
        {
            q6 = req.body.q6;
            if(req.body.q7 !== '')
            {
                q7 = req.body.q7;
                let application = new Application({
                    user_id: req.user.discordId,
                    username: req.user.username,
                    first_question: q1,
                    second_question: q2,
                    third_question: q3,
                    fourth_question: q4,
                    fith_question: q5,
                    sixth_question: q6,
                    seventh_question: q7,
                    comments: [],
                    votes: [],
                    status: 0, // 0 = Voting, 1 = Closed
                    timestamp: Math.round(new Date().getTime() / 1000)
                });

                application.save((err, app) => {
                    if(err)
                    {
                        // Adds a Flash Message
                        req.session.sessionFlash = {
                            type: 'error',
                            message: '<p>Somthing went wrong please try again later.</p>'
                        }
    
                        res.redirect('back');
                    }
                    else
                    {
                        res.redirect('/applications/view/' + app._id);
                    }
                });
            }
            else
            {
                let msg = '<ul class="list-group" style="list-style-type: none;">';
                msg += '<li> > Question 7 is Required if you filled out Question 6.</li>';
                msg += '</ul>';

                // Adds a Flash Message
                req.session.sessionFlash = {
                    type: 'error',
                    message: msg
                }

                if(req.body.q2 !== '')
                {
                    req.session.sessionFlash.q2 = req.body.q2;
                }

                if(req.body.q6 !== '')
                {
                    req.session.sessionFlash.q6 = req.body.q6;
                }

                res.redirect('back');
            }
        }
        else
        {
            // Submit without Q6 and Q7
            let application = new Application({
                user_id: req.user.discordId,
                username: req.user.username,
                first_question: q1,
                second_question: q2,
                third_question: q3,
                fourth_question: q4,
                fith_question: q5,
                comments: [],
                votes: [],
                status: 0, // 0 = Voting, 1 = Closed
                timestamp: Math.round(new Date().getTime() / 1000)
            });

            application.save((err, app) => {
                if(err)
                {
                    // Adds a Flash Message
                    req.session.sessionFlash = {
                        type: 'error',
                        message: '<p>Somthing went wrong please try again later.</p>'
                    }

                    res.redirect('back');
                }
                else
                {
                    res.redirect('/applications/view/' + app._id);
                }
            });
        }
    }
});

module.exports = router;