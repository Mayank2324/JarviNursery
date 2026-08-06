const SibApiV3Sdk = require("@getbrevo/brevo");

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

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

    const email = {
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
    };

    const result = await apiInstance.sendTransacEmail(email);

    console.log("✅ Email sent successfully");
    console.log(result);

    return true;
  } catch (error) {
    console.error("❌ Brevo Email API Error:");
    console.error(error.response?.body || error);

    return false;
  }
};

module.exports = {
  sendOrderEmail,
};