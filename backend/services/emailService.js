const nodemailer = require("nodemailer");

console.log("========== BREVO CONFIG ==========");
console.log("BREVO_LOGIN:", process.env.BREVO_LOGIN);
console.log("BREVO_SENDER_EMAIL:", process.env.BREVO_SENDER_EMAIL);
console.log("OWNER_EMAIL:", process.env.OWNER_EMAIL);
console.log("SMTP KEY EXISTS:", !!process.env.BREVO_SMTP_KEY);
console.log("==================================");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Brevo SMTP Verify Error:", error);
  } else {
    console.log("✅ Brevo SMTP Server is ready");
  }
});

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

    await transporter.sendMail({
      from: `"Jarvi Nursery" <${process.env.BREVO_SENDER_EMAIL}>`,
      to: process.env.OWNER_EMAIL,
      subject: `🌱 New Order Received - ${order.uniqueId}`,
      text: `
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
    });

    console.log("✅ Order email sent successfully.");
    return true;
  } catch (error) {
    console.error("❌ Email Error:", error);
    return false;
  }
};

module.exports = {
  sendOrderEmail,
};