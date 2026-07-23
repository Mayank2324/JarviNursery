const axios = require("axios");

/**
 * ==========================================
 * Expected Delivery Window
 * Saplings are typically ready 40-45 days
 * after the order date. This builds a
 * readable date range, e.g. "12 Sep 2026 - 17 Sep 2026".
 * ==========================================
 */
const MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

function getExpectedDeliveryWindow(orderDate) {

    const baseDate = orderDate ? new Date(orderDate) : new Date();

    const start = new Date(baseDate);
    start.setDate(start.getDate() + 40);

    const end = new Date(baseDate);
    end.setDate(end.getDate() + 45);

    return `${formatDate(start)} - ${formatDate(end)}`;

}

function getOrderDateFormatted(orderDate) {

    const baseDate = orderDate ? new Date(orderDate) : new Date();

    return formatDate(baseDate);

}

/**
 * ==========================================
 * Send WhatsApp Template Message
 * ==========================================
 */
async function sendWhatsApp(number, messageId, variables) {

    try {

        const response = await axios.get(
            "https://www.fast2sms.com/dev/whatsapp",
            {
                params: {

                    authorization: process.env.FAST2SMS_API_KEY,

                    phone_number_id: process.env.PHONE_NUMBER_ID,

                    message_id: messageId,

                    numbers: number,

                    variables_values: variables.join("|")

                }
            }
        );

        console.log("========== WHATSAPP ==========");
        console.log(response.data);
        console.log("==============================");

        return response.data.success === true;

    } catch (err) {

        console.log(
            "WhatsApp Error:",
            err.response?.data || err.message
        );

        return false;

    }

}

/**
 * ==========================================
 * OWNER NOTIFICATION
 * Template:
 * new_order_notification
 * ==========================================
 */
async function sendOwnerNotification(order) {

    if (!process.env.OWNER_MOBILE) {

        console.log("OWNER_MOBILE Missing");

        return false;

    }

    const variables = [

        order.uniqueId,

        order.farmerName,

        order.mobile,

        order.village,

        order.deliveryDate

    ];

    const sent = await sendWhatsApp(

        process.env.OWNER_MOBILE,

        process.env.OWNER_TEMPLATE_ID,

        variables

    );

    if (sent)
        console.log("✅ Owner WhatsApp Sent");

    return sent;

}

/**
 * ==========================================
 * CUSTOMER NOTIFICATION
 * Template:
 * order_confirmation
 * ==========================================
 */
async function sendCustomerNotification(order) {

    const variables = [

        order.farmerName,

        order.uniqueId,

        // {{3}} Order Date - the day the order was actually placed
        getOrderDateFormatted(order.createdAt),

        // {{4}} Expected Delivery - a 40 to 45 day window from the order date
        // e.g. "28 Aug 2026 - 02 Sep 2026"
        getExpectedDeliveryWindow(order.createdAt)

    ];

    const sent = await sendWhatsApp(

        order.mobile,

        process.env.CUSTOMER_TEMPLATE_ID,

        variables

    );

    if (sent)
        console.log("✅ Customer WhatsApp Sent");

    return sent;

}

module.exports = {

    sendOwnerNotification,

    sendCustomerNotification,

    getExpectedDeliveryWindow,

    getOrderDateFormatted

};
