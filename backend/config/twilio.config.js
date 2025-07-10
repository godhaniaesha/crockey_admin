const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

function getClient() {
    if (!accountSid || !authToken) {
        throw new Error('Twilio credentials are not set in environment variables');
    }
    return twilio(accountSid, authToken);
}

module.exports = {
    getClient,
    phoneNumber
};
