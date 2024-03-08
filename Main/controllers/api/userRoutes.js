const router = require('express').Router();
const { User, UserMeeting } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const { name, meeting_hash, potential_times } = req.body;

    // Create the user
    const userData = await User.create({ name });
    console.log(potential_times);
    console.log(userData.id);
    console.log(meeting_hash);
    // Associate the user with the meeting
    const userMeetingData = await UserMeeting.create({
      user_id: userData.id,
      meeting_hash,
      potential_times,
    });
    console.log(userMeetingData);

    res.status(200).json(userData);
  } catch (err) {
    console.error('Error creating user meeting:', err);
    console.error('Error details:', err.message);
    console.error('Error stack trace:', err.stack);
    res
      .status(400)
      .json({
        error: 'An error occurred while creating the user meeting.',
        details: err.message,
      });
  }
});

router.put('/update-availability', async (req, res) => {
  try {
    const { name, meeting_hash, potential_times } = req.body;

    // Find all UserMeeting records for the given meeting hash
    const userMeetings = await UserMeeting.findAll({
      where: { meeting_hash },
    });

    let userMeeting;
    let user;

    // Check if any of the associated users have the same name
    for (const um of userMeetings) {
      const associatedUser = await User.findOne({ where: { id: um.user_id } });
      if (associatedUser && associatedUser.name === name) {
        userMeeting = um;
        user = associatedUser;
        break;
      }
    }

    if (userMeeting) {
      // Update the potential_times for the existing UserMeeting record
      await userMeeting.update({ potential_times });
    } else {
      // Create a new user and associate with the meeting
      user = await User.create({ name });
      await UserMeeting.create({
        user_id: user.id,
        meeting_hash,
        potential_times,
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Error updating availability:', err);
    res
      .status(500)
      .json({ error: 'An error occurred while updating availability.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
