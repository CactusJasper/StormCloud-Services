const Application = require('./models/application');
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

exports.levelToText = (level) => {
    if(level == 'mod')
    {
        return "Moderator";
    }
    else if(level == 'admin')
    {
        return "Administrator";
    }
    else if(level == 'co-o')
    {
        return "Co-Owner";
    }
    else
    {
        return "User";
    }
}

exports.canCreateApplication = async (discordId) => {
    let toReturn;
    await Application.find({ user_id: discordId }, (err, docs) => {
        if(err)
        {
            toReturn = {
                status: 500,
                message: 'Internal Server Error'
            };
        }
        else
        {
            if(docs.length > 0)
            {
                let applications = docs.sort((a, b) => {
                    return b.timestamp - a.timestamp;
                });

                // Check if it has been 4 Weeks since last application
                if(applications[0].timestamp >= applications[0].timestamp + 2419200)
                {
                    toReturn = {
                        status: 200,
                        canCreate: true
                    };
                }
                else
                {
                    toReturn = {
                        status: 200,
                        canCreate: false
                    };
                }
            }
            else
            {
                toReturn = {
                    status: 200,
                    canCreate: true
                };
            }
        }
    });

    return toReturn;
}

exports.getPollOptions = async (body) => {
    let toReturn = [];
    let count = body.count;

    for(let i = 1;  i <= count; i++)
    {
        if(i == 1)
            toReturn.push({
                vote_string: body.o1,
                value: 1
            });
        else if(i == 2)
            toReturn.push({
                vote_string: body.o2,
                value: 2
            });
        else if(i == 3)
            toReturn.push({
                vote_string: body.o3,
                value: 3
            });
        else if(i == 4)
            toReturn.push({
                vote_string: body.o4,
                value: 4
            });
        else if(i == 5)
            toReturn.push({
                vote_string: body.o5,
                value: 5
            });
        else if(i == 6)
            toReturn.push({
                vote_string: body.o6,
                value: 6
            });
        else if(i == 7)
            toReturn.push({
                vote_string: body.o7,
                value: 7
            });
        else if(i == 8)
            toReturn.push({
                vote_string: body.o8,
                value: 8
            });
        else if(i == 9)
            toReturn.push({
                vote_string: body.o9,
                value: 9
            });
        else if(i == 10)
            toReturn.push({
                vote_string: body.o10,
                value: 10
            });
        else if(i == 11)
            toReturn.push({
                vote_string: body.o11,
                value: 11
            });
        else if(i == 12)
            toReturn.push({
                vote_string: body.o12,
                value: 12
            });
        else if(i == 13)
            toReturn.push({
                vote_string: body.o13,
                value: 13
            });
        else if(i == 14)
            toReturn.push({
                vote_string: body.o14,
                value: 14
            });
        else if(i == 15)
            toReturn.push({
                vote_string: body.o15,
                value: 15
            });
    }

    return toReturn;
}

exports.setChecked = (value, currentValue) => {
    if(value == currentValue)
    {
        return "checked";
    }
    else
    {
        return "";
    }
}