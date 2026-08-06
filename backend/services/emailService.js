const nodemailer = require("nodemailer");
const dns = require("dns");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4,
  dnsLookup: (hostname, options, callback) => {
    dns.lookup(hostname, { family: 4 }, callback);
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Verify Error:", error);
  } else {
    console.log("✅ SMTP Server is ready");
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
      from: `"Jarvi Nursery" <${process.env.EMAIL_USER}>`,
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