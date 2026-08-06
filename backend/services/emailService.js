const axios = require("axios");

const sendOrderEmail = async (order) => {
  try {
    const varieties = [];

    if (order.varieties.jarviRed > 0)
      varieties.push(`Jarvi Red: ${order.varieties.jarviRed}`);

    if (order.varieties.jarviRed1 > 0)
      varieties.push(`Jarvi Red 1: ${order.varieties.jarviRed1}`);

    if (order.varieties.jarviRedPlus > 0)
      varieties.push(`Jarvi Red Plus: ${order.varieties.jarviRedPlus}`);

    if (order.varieties.jarviWhiteHoney > 0)
      varieties.push(`Jarvi White Honey: ${order.varieties.jarviWhiteHoney}`);

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Jarvi Nursery",
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [
          {
            email: process.env.OWNER_EMAIL,
          },
        ],
        subject: `🌱 New Order Received - ${order.uniqueId}`,
        textContent: `
New Order Received

Order ID: ${order.uniqueId}

Customer Name: ${order.farmerName}

Mobile: ${order.mobile}

Address:
${order.fullAddress},
${order.village},
${order.district},
${order.state} - ${order.pinCode}

Delivery Date: ${order.deliveryDate}

Ordered Varieties:
${varieties.join("\n")}
        `,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully using Brevo API");
    return true;
  } catch (error) {
    console.error("❌ Brevo API Error:");

    if (error.response) {
      console.error(error.response.status);
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

    return false;
  }
};

module.exports = {
  sendOrderEmail,
};