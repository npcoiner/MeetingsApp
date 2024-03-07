const router = require('express').Router();
const { Meeting, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all meetings and JOIN with user data
    const meetingData = await Meeting.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const meetings = meetingData.map((meeting) => meeting.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      meetings, 
      logged_in: req.session.logged_in,
      cssFile: 'style.css'
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/v2', async (req, res) => {
  try {
    // Get all meetings and JOIN with user data
    const meetingData = await Meeting.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const meetings = meetingData.map((meeting) => meeting.get({ plain: true }));
    // Pass serialized data and session flag into template
    res.render('homepagev2', { 
      meetings, 
      logged_in: req.session.logged_in ,
      cssFile: 'style2.css' 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/meeting/:id', async (req, res) => {
  try {
    const meetingData = await Meeting.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const meeting = meetingData.get({ plain: true });

    res.render('meeting', {
      ...meeting,
      title: meeting.title,
      description: meeting.description,
      start_date: meeting.start_date,
      potential_times: JSON.stringify(meeting.potential_times),
      logged_in: req.session.logged_in,
      cssFile: 'style2.css',
    });
  } catch (err) {
    console.error('Error fetching meeting:', err);
    res.status(500).render('500', { error: 'An error occurred while fetching the meeting.' });
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Meeting }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true,
      cssFile: 'style.css'
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login', {
    cssFile: 'style.css'
  });
});

module.exports = router;
