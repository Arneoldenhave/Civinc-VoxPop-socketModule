const router = require('express').Router();


router.use('/sockets', require('./sockets'));

module.exports = router;