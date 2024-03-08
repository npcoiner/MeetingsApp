require('dotenv').config();
const axios = require('axios');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const accountId = process.env.ACCOUNT_ID;

const authTokenUrl = 'https://zoom.us/oauth/token';
const apiBaseUrl = 'https://api.zoom.us/v2';
const createMeeting = async (commonTime) => {
  try {
    
    const response = await axios.post(authTokenUrl, {
      grant_type: 'account_credentials',
      account_id: accountId,
    }, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic dTduOE13Nk5UZXVUSlZyU2FJbkNxQTpsOWlJTzYxQzRzZVhkbUJWNHEwNUtDSnJyRXlSdjZ1MA=="
      },
    });

    if (response.status !== 200) {
      console.log('Unable to get access token');
      return;
    }

    const responseData = response.data;
    const accessToken = responseData.access_token;

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    const meetingStartTime = `${commonTime[0].date}T${commonTime[0].time.split(' ')[0].padStart(2, '0')}:00:00Z`;
    console.log(meetingStartTime)
    const payload = {
      topic: 'My Meeting',
      duration: 60,
      start_time: meetingStartTime,
      timezone: 'America/Los_Angeles',
      type: 2,
      settings: {
        waiting_room: 'True'
      }
    };


    

    const meetingResponse = await axios.post(`${apiBaseUrl}/users/me/meetings`, payload, {
      headers: headers,
    });

    console.log('Meeting created successfully:', meetingResponse.data);
    return meetingResponse.data;
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
};

module.exports = {
  createMeeting,
};