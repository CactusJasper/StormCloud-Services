let express = require('express');
let router = express.Router();
let middleware = require('../utils/middleware');

router.get('/2048', middleware.ensureAuthenticated, (req, res) => {
    res.render('games/2048');
});

module.exports = router;