let seeder = require('mongoose-seed');
const dbConf = require('./config/database');

seeder.connect(dbConf.db_url, () => {
    seeder.loadModels(['./models/custom_role.js']);

    seeder.populateModels(data, () => {
        seeder.disconnect();
    });
});

let data = [{
    'model': 'CustomRole',
    'documents': [{
        'name': 'Event Planner',
        'description': 'This role is for people who verify events.',
        'permissions': ['sc.admin.planner.events.*']
    },
    {
        'name': 'Poll Manager',
        'description': 'This role allows people to manage polls.',
        'permissions': ['sc.admin.polls.*']
    },
    {
        'name': 'Application Manager',
        'description': 'This role to allows people to manage applications such as (delete, close, etc) applications.',
        'permissions': ['sc.admin.applications.*']
    },
    {
        'name': 'Super User',
        'description': 'This role that grants a person full powers over every asspect.',
        'permissions': ['sc.admin.*']
    },
    {
        'name': 'User (No Polls)',
        'description': 'This role allows the user to access every part of the user features except polls.',
        'permissions': ['sc.user.applications.*', 'sc.user.planner.*']
    },
    {
        'name': 'User (No Applications)',
        'description': 'This role allows the user to access every part of the user features except creating applications.',
        'permissions': ['sc.user.polls.*', 'sc.user.planner.*']
    },
    {
        'name': 'User',
        'description': 'This role is given to every member of the website',
        'permissions': ['sc.user.*']
    }]
}];

/*
=================================================== Diffrent Permissions ===================================================
> sc.admin.* - Allows the User Access to every admin feature used for users such as Wolfy and Super Admins who are hightly
trusted this is because the permission given are the ability to modify everything from moderation roles and level rewards
> sc.admin.planner.* - Allows the User Access to do everything involving the Planner Feature
> sc.admin.polls.* - Allows the User Access to do everything involving the Polls Feature
> sc.admin.applications.* - Allows the User Access to do everything involving the Applications Feature

> sc.user.* - Allows the User to Access every user part of the Sites Features
> sc.user.applications.* - Allows the User Access to every part of the User facing parts of the Applications Feature
> sc.user.polls.* - Allows the User Access to ever part of the User facing Polls Feature
> sc.user.planner.* - Allows the User Access to every part of the User facing Planner Feature
*/

/*
Design Specification:
The outline of the above system is implment site based user permissions for diffrent features each user can have one role
more roles can be created by Jasper and Wolfy only the ability to create more roles like these should only be given to Jasper and Wolfy 
to prevent abuse of the site based role system this system will eventually be given access to the games site as well as the feature set grows 
this will also be able to be extended to allow for use defiend roles such as gender and such when the server grows to the point where it reaches 
the discord role cap this system can also be implmented for some commands such as if you want to have a message translated to use correct pronouns 
for a target user thissystem can be expanded upon as the StormCloud website grows and as the community grows with more intresting ideas been 
implmented the system might require modification down the line to allow for multi roles where the user can be given more than one role granting 
specific permissions
*/