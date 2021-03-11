const express = require('express');
let app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const compression = require('compression');
const path = require('path');
const mongoose = require('mongoose');
let csrf = require('csurf');
const helmet = require("helmet");
let cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');
let exphbs = require('express-handlebars');
let helpers = require('handlebars-helpers')();
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const { check, validationResult, expressValidator } = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const config = require('./config/config');
const dbConf = require('./config/database');
const utils = require('./utils');

// Connect to DB
mongoose.connect(dbConf.db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    poolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
}).then((res) => {
    console.log('Connected to DB Server');
    /*app.listen(8080, () => {
        console.log("Server Started on port 8080");
    });*/
    http.listen(8080, () => {
    console.log(`listening on *:${8080}`);
    });
}).catch((err) => {
    console.error(err);
});
let db = mongoose.connection;

// Helmet Security / Performance
app.disable("x-powered-by");
app.use(helmet.frameguard({
    action: 'DENY'
}));
app.use(helmet.permittedCrossDomainPolicies({
    permittedPolicies: "none",
}));
app.use(helmet.dnsPrefetchControl({
    allow: true,
}));
app.use(helmet.noSniff());
app.use(helmet.hsts({
    maxAge: 63072000,
    preload: true,
}));

// Register the compression Middleware
app.use(compression({
    level: 9
}));

Handlebars.registerHelper('getPfpIco', (userId, avatarId) => {
    if(avatarId == undefined)
    {
        return 'https://cdn.discordapp.com/avatars/783811510652239904/08db214786c860678804c24f77834927.png';
    }
    else
    {
        return `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png`;
    }
});

Handlebars.registerHelper('ifCond', (v1, operator, v2, options) => {
    switch(operator)
    {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

// Load Tamplate Engine
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    partialsDir: __dirname + '/views/partials/',
    helpers: helpers
}));
app.set('view engine', '.hbs');

// Set the Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Register Express Session Middleware
let sessionMiddleware = session({
    secret: config.secret,
    name: 'StormCloud Dashboard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        secret: config.secret_store,
        mongooseConnection: db,
        ttl: 4 * 24 * 60 * 60, // = 4 days
        autoRemove: 'interval',
        autoRemoveInterval: 15 // In minutes.
    })
});
app.use(sessionMiddleware);

// Register Express Message Middleware
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Display Flash Messages Middleware
app.use((req, res, next) => {
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    req.session.flash = undefined;
    next();
});

// Load Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Setup cookie parser middleware
app.use(cookieParser());

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

app.get('/', (req, res) => {
    if(req.user)
    {
        utils.isAdmin(req.user).then((admin) => {
            if(admin || utils.isWolfy(req.user) || utils.isJasper(req.user))
            {
                res.render('index', {
                    user: req.user,
                    admin: true
                });
            }
            else
            {
                res.render('index', {
                    user: req.user
                });
            }
        }).catch((err) => {
            res.render('index', {
                user: req.user
            });
        });        
    }
    else
    {
        res.render('index', { layout: false });
    }
});

app.get('/leaderboard', utils.ensureAuthenticated, (req, res) => {
    utils.isAdmin(req.user).then((admin) => {
        if(admin || utils.isWolfy(req.user) || utils.isJasper(req.user))
        {
            res.render('leaderboard', {
                user: req.user,
                admin: true
            });
        }
        else
        {
            res.render('leaderboard', {
                user: req.user
            });
        }
    }).catch((err) => {
        res.render('leaderboard', {
            user: req.user
        });
    });  
});

app.use('/auth', require('./routes/auth'));
app.use('/applications', require('./routes/applications'));
app.use('/admin', require('./routes/admin'));

/* MUST BE LAST ROUTE FOR 404 NOT FOUND ERROR */
app.all('*', (req, res) => {
    res.render('errors/404', { layout: false });
});

/* HANDLE 500 ERRORS */
app.use((err, req, res, next) => {
    if(process.env.NODE_ENV != 'production')
    {
        console.error(err.stack);
    }
    
    res.render('errors/500', { layout: false });
});

/*
 * ========================================
 * =========== WebSocket Server ===========
 * ========================================
 */
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

io.on('connection', (socket) => {
    let userId = socket.request.session.passport.user;
    if(userId !== undefined || userId != {})
    {
        require('./events/home')(socket, io); // Home Page Socket Event Handler
        require('./events/view_application')(socket, io); // Application View Socket Event Handler
        require('./events/user_data')(socket, io); // User Data Socket Event Handler
        require('./events/admin/roles/manage_rewards')(socket, io) // Manage Role Rewards Socket Event Handler
        require('./events/admin/roles/manage_mod_roles')(socket, io) // Manage Moderation Roles Socket Event Handler
        require('./events/global')(socket, io); // Global Socket Event Handler
    }
});
