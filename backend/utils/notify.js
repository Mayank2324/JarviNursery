const { sendOrderEmail } = require("../services/emailService");
const { sendSMS } = require("./fast2sms"); // Keep your existing SMS utility

async function sendOwnerNotification(order) {
    return await sendOrderEmail(order);
}

async function sendCustomerNotification(order) {
    return await sendSMS(order);
}

module.exports = {
    sendOwnerNotification,
    sendCustomerNotification
};