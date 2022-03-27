const Application = require('./models/application');
let ModRole = require('./models/mod_role');

exports.isAdmin = (user) => {
    return user.admin === true;
}

exports.isSuperuser = (user) => {
    return user.superuser === true;
}

exports.isEventManager = (user) => {
    return user.event_manager === true;
}

exports.isWolfy = (user) => {
    return user.discordId === '228618507955208192';
}

exports.isJasper = (user) => {
    return user.discordId === '217387293571284992';
}

exports.ensureAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) return next();
	res.redirect('/');
}

exports.ensureNotAuthenticated = (req, res, next) => {
    if(!req.isAuthenticated()) return next();
	res.redirect('/');
}

exports.convertToTextApplications = (q) => {
	switch(q) {
		case 0: return "Barely";
		case 1: return "Once every 2 or more weeks";
		case 2: return "Once a week, or a few times";
		case 3: return "Everyday";
		case 4: return "A lot, every hour or two";
		case 5: return "Every minute except when I need to use my essentials";
		default: return q;
	}
}

exports.levelToText = (level) => {
	switch(level) {
		case 'mod': return "Moderator";
		case 'admin': return "Administrator";
		case 'co-o': return "Co-Owner";
		default: return "User";
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
		switch(i) {
			case 1:
				toReturn.push({ vote_string: body.o1, value: 1 });
				break;
			case 2:
				toReturn.push({ vote_string: body.o2, value: 2 });
				break;
			case 3:
				toReturn.push({ vote_string: body.o3, value: 3 });
				break;
			case 4:
				toReturn.push({ vote_string: body.o4, value: 4 });
				break;
			case 5:
				toReturn.push({ vote_string: body.o5, value: 5 });
				break;
			case 6:
				toReturn.push({ vote_string: body.o6, value: 6 });
				break;
			case 7:
				toReturn.push({ vote_string: body.o7, value: 7 });
				break;
			case 8:
				toReturn.push({ vote_string: body.o8, value: 8 });
				break;
			case 9:
				toReturn.push({ vote_string: body.o9, value: 9 });
				break;
			case 10:
				toReturn.push({ vote_string: body.o10, value: 10 });
				break;
			case 11:
				toReturn.push({ vote_string: body.o11, value: 11 });
				break;
			case 12:
				toReturn.push({ vote_string: body.o12, value: 12 });
				break;
			case 13:
				toReturn.push({ vote_string: body.o13, value: 13 });
				break;
			case 14:
				toReturn.push({ vote_string: body.o14, value: 14 });
				break;
			case 15:
				toReturn.push({ vote_string: body.o15, value: 15 });
				break;
		}
    }

    return toReturn;
}

exports.setChecked = (value, currentValue) => {
	return value === currentValue ? "checked" : "";
}