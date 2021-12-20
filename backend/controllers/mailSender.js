const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { config } = require('dotenv');

config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const sendMail = async (mail, subject, text) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        type: process.env.AUTH_TYPE,
        user: process.env.USER_MAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken,
      },
    });
    const Info = await transport.sendMail({
      from: process.env.USER_MAIL,
      to: mail,
      subject,
      text,
    });

    return Info;
  } catch (error) {
    return error;
  }
};

module.exports = sendMail;
