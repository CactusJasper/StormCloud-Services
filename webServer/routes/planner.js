let express = require('express');
let router = express.Router();
let utils = require('../utils');
let ServerEvent = require('../models/server_event');
let csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });
const { check, validationResult, expressValidator } = require('express-validator');

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
    check('eventTitle').notEmpty().withMessage('Please provide a title for the event.'),
    check('eventTitle').isLength({ max: 32 }).withMessage('An events name can be a maximum of 32 chracters.'),
    check('eventDesc').notEmpty().withMessage('Please provide an event description.'),
    check('eventDesc').isLength({ max: 500 }).withMessage('An events description can be a maximum of 500 chracters.'),
    check('voiceCall').notEmpty().withMessage('Please provide a voice chat for the event.'),
    check('voiceCall').isLength({ max: 32 }).withMessage('A voice calls name can be a maximum of 32 characters.'),
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

        if(req.body.eventTitle !== '')
            req.session.sessionFlash.eventTitle = req.body.eventTitle;

        if(req.body.eventDesc !== '')
            req.session.sessionFlash.eventDesc = req.body.eventDesc;

        if(req.body.voiceCall !== '')
            req.session.sessionFlash.voiceCall = req.body.voiceCall;

        if(req.body.gameName !== '')
            req.session.sessionFlash.gameName = req.body.gameName;

        if(req.body.eventDate !== '')
            req.session.sessionFlash.eventDate = req.body.eventDate;

        if(req.body.eventTime !== '')
            req.session.sessionFlash.eventTime = req.body.eventTime;

        res.redirect('back');
    }
    else
    {
        let game = req.body.eventGame;
        let date = req.body.eventDate.split('-');
        date = new Date(`${date[0]}-${date[1]}-${date[2]}T${req.body.eventTime}:00`);
        let createdAt = Math.floor(new Date().getTime() / 1000.0)

        if(validDate(date, createdAt))
        {
            let event = new ServerEvent({
                hostId: req.user.id,
                eventTitle: req.body.eventTitle,
                eventDesc: req.body.eventDesc,
                voiceCall: req.body.voiceCall,
                eventTime: Math.floor(date.getTime() / 1000.0),
                approved: false
            });

            if(game !== '')
                event.game = game;

            event.save((err, game) => {
                if(err)
                {
                    req.session.sessionFlash = {
                        type: 'error',
                        message: 'Something went wrong try again later.'
                    }

                    if(req.body.eventTitle !== '')
                        req.session.sessionFlash.eventTitle = req.body.eventTitle;
            
                    if(req.body.eventDesc !== '')
                        req.session.sessionFlash.eventDesc = req.body.eventDesc;
            
                    if(req.body.voiceCall !== '')
                        req.session.sessionFlash.voiceCall = req.body.voiceCall;
            
                    if(req.body.gameName !== '')
                        req.session.sessionFlash.gameName = req.body.gameName;
            
                    if(req.body.eventDate !== '')
                        req.session.sessionFlash.eventDate = req.body.eventDate;
            
                    if(req.body.eventTime !== '')
                        req.session.sessionFlash.eventTime = req.body.eventTime;

                    res.redirect('back');
                }
                else
                {
                    res.redirect('/planner');
                }
            });
        }
        else
        {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Please choose a valid date'
            }
    
            if(req.body.eventTitle !== '')
                req.session.sessionFlash.eventTitle = req.body.eventTitle;
    
            if(req.body.eventDesc !== '')
                req.session.sessionFlash.eventDesc = req.body.eventDesc;
    
            if(req.body.voiceCall !== '')
                req.session.sessionFlash.voiceCall = req.body.voiceCall;
    
            if(req.body.gameName !== '')
                req.session.sessionFlash.gameName = req.body.gameName;
    
            if(req.body.eventDate !== '')
                req.session.sessionFlash.eventDate = req.body.eventDate;
    
            if(req.body.eventTime !== '')
                req.session.sessionFlash.eventTime = req.body.eventTime;

            res.redirect('back');
        }
    }
});


function validDate(date, currentDate)
{
    if(date.getDate() === date.getDate() && currentDate + (3600 * 2) <= Math.floor(date.getTime() / 1000.0))
    {
        return true;
    }
    else
    {
        return false;
    }
}

module.exports = router;