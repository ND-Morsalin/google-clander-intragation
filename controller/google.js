const dotenv = require("dotenv");
dotenv.config();
const { google } = require("googleapis");
const { v4: uuidv4 } = require('uuid');

const auth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const scopes = ["https://www.googleapis.com/auth/calendar"];

const googleAuthController = async (req, res) => {
  const url = auth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  console.log(
    "🚀 ~ file: google.js ~ line 17 ~ googleAuthController ~ url",
    url
  );

  res.redirect(url);
};

const googleAuthCallback = async (req, res) => {
  const code = req.query.code;

  const { tokens } = await auth2Client.getToken(code);

  auth2Client.setCredentials(tokens);

  res.status(200).json({
    message: "Google Auth Callback",
    tokens,
  });
};

const scheduleEvent = async (req, res) => {
  const accessToken = auth2Client.credentials.access_token;
  console.log(
    "🚀 ~ file: google.js ~ line 53 ~ scheduleEvent ~ accessToken",
    accessToken
  );

  const calendar = google.calendar({
    version: "v3",
    auth: process.env.GOOGLE_API_KEY,
  });

  const event = {
    summary: "Happy Google I/O 2024",
    location: "800 Howard St., San Francisco, CA 94103",
    description: "A chance to hear more about Google's developer products.",
    start: {
      dateTime: "2024-05-3T09:00:00-07:00",
      timeZone: "America/Los_Angeles",
    },
    end: {
      dateTime: "2024-05-3T17:00:00-09:00",
      timeZone: "America/Los_Angeles",
    },
    attendees: [
      { email: "ndmorsalin99@gmail.com" },
      {
        email: "morsalin056@gmail.com",
      },
    ],
    conferenceData: {
      createRequest: {
        requestId: uuidv4(),
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
        
      ],
    },
  };

  calendar.events.insert(
    {
      calendarId: "primary",
      auth: auth2Client,
      resource: event,
      conferenceDataVersion: 1,
     /*  requestBody: {
        conferenceData: {
          createRequest: {
            requestId: uuidv4(),
          },
        },
        attendees: [
          { email: "ndmorsalin99@gmail.com" },
          {
            email: "morsalin056@gmail.com",
          },
        ],
      }, */
    },
    (err, event) => {
      if (err) {
        console.log(
          "🚀 ~ file: google.js ~ line 85 ~ calendar.events.insert ~ err",
          err
        );
        return res.status(400).json({
          message: "Error",
          err,
        });
      }
      console.log(
        "🚀 ~ file: google.js ~ line 92 ~ calendar.events.insert ~ event",
        event
      );
      res.status(200).json({
        message: "Event Scheduled",
        event,
      });
    }
  );
};

module.exports = {
  googleAuthController,
  googleAuthCallback,
  scheduleEvent,
};
