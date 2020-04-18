const router = require('express').Router();


router.use('/socket', require('./sockets'));

module.exports = router;