const router = require('express').Router();
const userRoutes = require('./userRoutes');
const meetingRoutes = require('./meetingRoutes');

router.use('/users', userRoutes);
router.use('/meetings', meetingRoutes);

module.exports = router;
