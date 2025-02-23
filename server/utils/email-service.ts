import nodemailer from "nodemailer";

export default async function sendEmailNotification(
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
      from: `የቦሌ መድሃኒአለም ፈለገ ዮርዳኖስ ሰንበት ት/ቤት" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Ticket Confirmation 🎫",
      html: `
        <img src="https://i.ibb.co/m5Y6QbW6/home.jpg" alt="home" border="0" width="300px">
        <h2>ሰላም ${userName},</h2>
        <p>ክፍያዎ ተቀባይነት <strong>አግኝቷል!</strong>! 🎉</p>
        <p>የቲኬት ቁጥር: <strong style="font-size: 18px;">${ticketNumber}</strong></p>
        <p>ቲኬት ስለገዙ እናመሰግናለን። እርስዎን ለማየት በጉጉት እንጠባበቃለን!</p>
        <br/>
        <p>የቦሌ መድሃኒአለም ፈለገ ዮርዳኖስ ሰንበት ት/ቤት</p>
      `,
    });

    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}
