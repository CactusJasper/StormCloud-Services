let ModRole = require('./models/mod_role');

exports.isAdmin = async (user) => {
    let isAdmin = false;
    await ModRole.find({}, (err, roles) => {
        if(roles)
        {
            for(let i = 0; i < roles.length; i++)
            {
                if(user.highest_role == roles[i].role_id)
                {
                    isAdmin = true;
                }
            }
        }
    });

    if(isAdmin)
    {
        return true;
    }
    else
    {
        return false;
    }
}

exports.isWolfy = (user) => {
    if(user.discordId == '228618507955208192')
    {
        return true;
    }
    else
    {
        return false;
    }
}

exports.isJasper = (user) => {
    if(user.discordId == '217387293571284992')
    {
        return true;
    }
    else
    {
        return false;
    }
}

exports.ensureAuthenticated = (req, res, next) => {
    if(req.isAuthenticated())
    {
        return next();
    }
    else
    {
        res.redirect('/');
    }
}

exports.ensureNotAuthenticated = (req, res, next) => {
    if(!req.isAuthenticated())
    {
        return next();
    }
    else
    {
        res.redirect('/');
    }
}

exports.convertToTextApplications = (q) => {
    if(q == 0)
    {
        return "Barely";
    }
    else if(q == 1)
    {
        return "Once every 2 or more weeks";
    }
    else if(q == 2)
    {
        return "Once a week, or a few times";
    }
    else if(q == 3)
    {
        return "Everyday";
    }
    else if(q == 4)
    {
        return "A lot, every hour or two";
    }
    else if(q == 5)
    {
        return "Every minute except when I need to use my essentials";
    }
    else
    {
        return q;
    }
}

exports.getPfpIco = (userId, avatarId) => {
    if(avatarId == undefined)
    {
        return 'https://cdn.discordapp.com/avatars/783811510652239904/08db214786c860678804c24f77834927.png';
    }
    else
    {
        return `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png`;
    }
}