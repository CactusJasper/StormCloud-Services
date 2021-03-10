let express = require('express');
let router = express.Router();
let utils = require('../utils');
let Server = require('../models/server');
let LevelReward = require('../models/level_reward');
let ModRole = require('../models/mod_role');
let Poll = require('../models/poll');
const { check, validationResult, expressValidator } = require('express-validator');
let csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });
let axios = require('axios');

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

router.get('/create/poll', csrfProtection, utils.ensureAuthenticated, (req, res) => {
    utils.isAdmin(req.user).then((admin) => {
        if(utils.isWolfy(req.user) || utils.isJasper(req.user))
        {
            res.render('admin/polls/create', {
                admin: true,
                superUser: true,
                user: req.user,
                csrfToken: req.csrfToken()
            });
        }
        else if(admin)
        {
            res.render('admin/polls/create', {
                admin: true,
                superUser: false,
                user: req.user,
                csrfToken: req.csrfToken()
            });
        }
        else
        {
            res.redirect('back');
        }
    });
});

router.post('/create/poll', csrfProtection, utils.ensureAuthenticated, [
    check('title').notEmpty().withMessage('Please provide a poll title.'),
    check('description').notEmpty().withMessage('Please provide a poll description.'),
    check('o1').notEmpty().withMessage('Please provide an option for option 1.'),
    check('o2').notEmpty().withMessage('Please provide an option for option 2.'),
    check('count').notEmpty().withMessage('Something went wrong.')
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

        res.redirect('back');
    }
    else
    {
        utils.isAdmin(req.user).then((admin) => {
            if(utils.isWolfy(req.user) || utils.isJasper(req.user))
            {
                let newPoll = new Poll({
                    creator_id: req.user.discordId,
                    title: req.body.title,
                    description: req.body.description,
                    options: [],
                    votes: [],
                    status: 1,
                    created_timestamp: Math.round(new Date().getTime() / 1000)
                });

                utils.getPollOptions(req.body).then((options) => {
                    newPoll.options = options;

                    newPoll.save((err, poll) => {
                        if(err)
                        {
                            req.session.sessionFlash = {
                                type: 'error',
                                message: 'Something went wrong try again later.'
                            }
                    
                            res.redirect('back');
                        }
                        else
                        {
                            res.redirect(`/polls/view/${poll.id}`);
                        }
                    });
                });
            }
            else if(admin)
            {
                let newPoll = new Poll({
                    creator_id: req.user.discordId,
                    title: req.body.title,
                    description: req.body.description,
                    options: [],
                    votes: [],
                    status: 0,
                    created_timestamp: Math.round(new Date().getTime() / 1000)
                });

                utils.getPollOptions(req.body).then((options) => {
                    newPoll.options = options;

                    newPoll.save((err, poll) => {
                        if(err)
                        {
                            req.session.sessionFlash = {
                                type: 'error',
                                message: 'Something went wrong try again later.'
                            }
                    
                            res.redirect('back');
                        }
                        else
                        {
                            res.redirect(`/polls/view/${poll.id}`);
                        }
                    });
                });
            }
            else
            {
                res.redirect('back');
            }
        });
    }
});

router.get('/manage/role/mods', utils.ensureAuthenticated, (req, res) => {
    if(utils.isWolfy(req.user) || utils.isJasper(req.user))
    {
        Server.findOne({ server_name: "StormCloud Services" }, (err, server) => {
            if(err)
            {
                res.redirect('back');
            }
            else
            {
                if(server)
                {
                    axios.get('http://localhost:9000/@roles', {
                        headers: {
                            api_id: server.api_id,
                            api_token: server.api_token
                        }
                    }).then(dat => {
                        let data = dat.data;
                        if(data.status == 200)
                        {
                            ModRole.find({}, (err, docs) => {
                                if(err)
                                {
                                    res.redirect('back');
                                }
                                else
                                {
                                    if(docs.length > 0)
                                    {
                                        let roles = [];
                                        let modRoles = [];

                                        for(let i = 0; i < data.roles.cache.length; i++)
                                        {
                                            let result = docs.find(({ role_id }) => role_id == data.roles.cache[i].id);
                                            if(result == undefined)
                                            {
                                                roles.push(data.roles.cache[i]);
                                            }
                                            else
                                            {
                                                modRoles.push({
                                                    _id: result._id,
                                                    level: result.level,
                                                    role_id: result.role_id,
                                                    role_name: data.roles.cache[i].name
                                                });
                                            }
                                        }

                                        modRoles.sort((a, b) => {
                                            return a.level - b.level;
                                        });

                                        res.render('admin/roles/modRoles', {
                                            roles: roles,
                                            modRoles: modRoles,
                                            admin: true,
                                            helpers: {
                                                levelToText: (level) => { return utils.levelToText(level) }
                                            }
                                        });
                                    }
                                    else
                                    {
                                        res.render('admin/roles/modRoles', {
                                            roles: data.roles.cache,
                                            admin: true,
                                            helpers: {
                                                levelToText: (level) => { return utils.levelToText(level) }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                        else
                        {
                            res.redirect('back');
                        }
                    }).catch(err => {
                        res.redirect('back');
                    });
                }
                else
                {
                    res.redirect('back');
                }
            }
        });
    }
    else
    {
        res.redirect('back');
    }
});

router.get('/manage/role/rewards', utils.ensureAuthenticated, (req, res) => {
    if(utils.isWolfy(req.user) || utils.isJasper(req.user))
    {
        Server.findOne({ server_name: "StormCloud Services" }, (err, server) => {
            if(err)
            {
                res.redirect('back');
            }
            else
            {
                if(server)
                {
                    axios.get('http://localhost:9000/@roles', {
                        headers: {
                            api_id: server.api_id,
                            api_token: server.api_token
                        }
                    }).then(dat => {
                        let data = dat.data;
                        if(data.status == 200)
                        {
                            LevelReward.find({}, (err, docs) => {
                                if(err)
                                {
                                    res.redirect('back');
                                }
                                else
                                {
                                    if(docs.length > 0)
                                    {
                                        let roles = [];
                                        let rewards = [];

                                        for(let i = 0; i < data.roles.cache.length; i++)
                                        {
                                            let result = docs.find(({ role_id }) => role_id == data.roles.cache[i].id);
                                            if(result == undefined)
                                            {
                                                roles.push(data.roles.cache[i]);
                                            }
                                            else
                                            {
                                                rewards.push({
                                                    _id: result._id,
                                                    level: result.level,
                                                    role_id: result.role_id,
                                                    role_name: data.roles.cache[i].name
                                                });
                                            }
                                        }

                                        rewards.sort((a, b) => {
                                            return a.level - b.level;
                                        });

                                        res.render('admin/roles/manageRewards', {
                                            admin: true,
                                            superUser: true,
                                            user: req.user,
                                            roles: roles,
                                            rewards: rewards,
                                        });
                                    }
                                    else
                                    {
                                        res.render('admin/roles/manageRewards', {
                                            admin: true,
                                            superUser: true,
                                            user: req.user,
                                            roles: data.roles.cache,
                                        });
                                    }
                                }
                            });
                        }
                        else
                        {
                            res.redirect('back');
                        }
                    }).catch(err => {
                        res.redirect('back');
                    });
                }
                else
                {
                    res.redirect('back');
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