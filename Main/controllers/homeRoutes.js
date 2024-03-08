const router = require('express').Router();
const { Meeting, User, UserMeeting } = require('../models');
const withAuth = require('../utils/auth');
const crypto = require('crypto');

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
      cssFile: 'style.css',
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
      logged_in: req.session.logged_in,
      cssFile: 'style2.css',
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/meeting/:hash', async (req, res) => {
  try {
    const meetingData = await Meeting.findOne({
      where: { hash: req.params.hash },
    });

    if (!meetingData) {
      return res.status(404).render('404', { error: 'Meeting not found.' });
    }

    const userMeetingData = await UserMeeting.findAll({
      where: { meeting_hash: meetingData.hash },
      attributes: ['user_id', 'potential_times'],
    });
    console.log(userMeetingData);
    const userIds = userMeetingData.map((userMeeting) => userMeeting.user_id);

    const potentialTimes = userMeetingData.reduce(
      (commonTimes, userMeeting) => {
        if (commonTimes.length === 0) {
          return userMeeting.potential_times;
        } else {
          console.log(userMeeting.potential_times);
          return commonTimes.filter((commonTime) =>
            userMeeting.potential_times.some(
              (time) => time.date === commonTime.date && time.time === commonTime.time
            )
          );
        }
      },
      userMeetingData[0].potential_times
    );

    const userData = await User.findAll({
      where: { id: userIds },
      attributes: ['id', 'name'],
    });

    const compatibleUserData = userData.map((user) =>
      user.get({ plain: true }),
    );
    console.log('potentialTimes');

    console.log(potentialTimes);

    res.render('meeting', {
      ...meetingData.get({ plain: true }),
      users: compatibleUserData,
      potentialTimes: JSON.stringify(potentialTimes),
      startDate: meetingData.start_date,
      logged_in: req.session.logged_in,
      cssFile: 'style2.css',
    });
  } catch (err) {
    console.error('Error fetching meeting:', err);
    res
      .status(500)
      .render('500', {
        error: 'An error occurred while fetching the meeting.',
      });
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
      cssFile: 'style.css',
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
    cssFile: 'style.css',
  });
});

module.exports = router;
