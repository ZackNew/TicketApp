import nodemailer from "nodemailer";

export async function sendEmailNotification(
  email: string,
  userName: string,
  ticketNumber: string
) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Felege Yordanos Ticket" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Ticket Confirmation 🎫",
      html: `
        <h2>Hello ${userName},</h2>
        <p>Your payment has been <strong>approved</strong>! 🎉</p>
        <p>Your ticket number is: <strong style="font-size: 18px;">${ticketNumber}</strong></p>
        <p>Thank you for using our service. We look forward to seeing you!</p>
        <br/>
        <p>Best Regards,<br/>Ticketing Team</p>
      `,
    });

    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}
