const router = require('express').Router();
const { Meeting, User, UserMeeting } = require('../../models');
const withAuth = require('../../utils/auth');
const crypto = require('crypto');

const generateHash = () => {
  return crypto.randomBytes(20).toString('hex');
};


router.post('/', withAuth, async (req, res) => {
  try {
    const { title, description, potential_times } = req.body;
    const start_date = potential_times[0].date;
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
    res.status(500).json({ error: 'An error occurred while creating the meeting.' });
  }
});

router.get('/:hash/common-times', async (req, res) => {
  try {
    const meetingHash = req.params.hash;
    const commonTimes = await findCommonTimes(meetingHash);
    res.status(200).json({ commonTimes });
  } catch (err) {
    console.error('Error finding common times:', err);
    res.status(500).json({ error: 'An error occurred while finding common times.' });
  }
});

module.exports = router;