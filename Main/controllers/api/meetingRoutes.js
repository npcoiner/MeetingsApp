const router = require('express').Router();
const { Meeting } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
    try {
      const { title, description, potential_times } = req.body;
      const start_date = potential_times[0].date;
      const meetingData = await Meeting.create({
        title,
        description,
        potential_times,
        start_date,
        user_id: req.session.user_id,
      });
        res.status(200).json(meetingData);
    } catch (err) {
        console.error('Error creating meeting:', err);
        res.status(500).json({ error: 'An error occurred while creating the meeting.' });
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const meetingData = await Meeting.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!meetingData) {
            res.status(404).json({ message: 'No meeting found with this id!' });
            return;
        }

        res.status(200).json(meetingData);
    } catch (err) {
        console.error('Error deleting meeting:', err);
        res.status(500).json({ error: 'An error occurred while deleting the meeting.' });
    }
});

module.exports = router;