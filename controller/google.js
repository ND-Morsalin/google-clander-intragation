const dotenv = require("dotenv");
dotenv.config();
const { google } = require("googleapis");
const googleAuthController = async (req, res) => {
  const auth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const scopes = ["https://www.googleapis.com/auth/calendar"];

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
  const auth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const code = req.query.code;

  const { tokens } = await auth2Client.getToken(code);

  auth2Client.setCredentials(tokens);

  res.status(200).json({
    message: "Google Auth Callback",
    tokens,
  });
};

module.exports = {
  googleAuthController,
  googleAuthCallback,
};
