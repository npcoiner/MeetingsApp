const router = require('express').Router();
const { Meeting, User, UserMeeting } = require('../../models');
const withAuth = require('../../utils/auth');
const { createMeeting } = require('../../utils/zoomHelper');
const crypto = require('crypto');

const generateHash = () => {
  return crypto.randomBytes(20).toString('hex');
};

router.post('/', withAuth, async (req, res) => {
  try {
    const { title, description, potential_times, start_date } = req.body;
    const hash = generateHash();

    const meetingData = await Meeting.create({
      title,
      description,
      potential_times,
      start_date,
      user_id: req.session.user_id,
      hash: hash,
    });

    res.status(200).json(meetingData);
  } catch (err) {
    console.error('Error creating meeting:', err);
    res
      .status(500)
      .json({ error: 'An error occurred while creating the meeting.' });
  }
});


router.post('/:hash/zoom', async (req, res) => {
  try {
    const { commonTimes } = req.body;

    if (!commonTimes || commonTimes.length === 0) {
      return res.status(400).json({ error: 'No common times provided.' });
    }

    const zoomMeetingData = await createMeeting(commonTimes);

    res.status(200).json(zoomMeetingData);
  } catch (err) {
    console.error('Error creating Zoom meeting:', err);
    res.status(500).json({ error: 'An error occurred while creating the Zoom meeting.' });
  }
});

module.exports = router;
