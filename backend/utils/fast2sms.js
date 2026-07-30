const axios = require("axios");

async function sendSMS(order) {
    try {
        const message = `Dear ${order.farmerName},

Your order has been received.

Order ID: ${order.uniqueId}
Expected Delivery: Within 40 to 45 days

Thank you.`;

        const response = await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            {
                route: "q",
                message,
                language: "english",
                flash: 0,
                numbers: order.mobile,
            },
            {
                headers: {
                    authorization: process.env.FAST2SMS_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("SMS Sent:", response.data);
        return true;
    } catch (err) {
        console.error(
            "SMS Error:",
            err.response?.data || err.message
        );
        return false;
    }
}

module.exports = { sendSMS };
