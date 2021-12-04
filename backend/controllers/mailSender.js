const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID =
  '51078219443-2jdth2hq5jovq8r9od6vm0e7d3vc7njf.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN =
  '1//04wclBajJJlmeCgYIARAAGAQSNwF-L9Ir3fob279j7SYoAFB-eVm0kF28X6zSPV1Mo8Rq4f-pOEl4czKYbXPEBADRKHh4BOSuZ1c';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMail = async (mail, subject, text) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        type: 'OAuth2',
        user: 'airlineschad@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });

    const Info = await transport.sendMail({
      from: 'chad airlines <airlineschad@gmail.com>',
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
