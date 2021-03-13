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