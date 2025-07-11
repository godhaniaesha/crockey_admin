const twilio = require('twilio');

const getClient = () => {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        throw new Error('Twilio credentials are not set in environment variables');
    }
    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

module.exports = {
    getClient,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
};
