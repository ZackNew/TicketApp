import nodemailer from "nodemailer";

export default async function sendEmailNotification(
  email: string,
  userName: string,
  ticketNumbers: string[]
) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const ticketListHtml = ticketNumbers
      .map((ticket) => `<li><strong>${ticket}</strong></li>`)
      .join("");

    await transporter.sendMail({
      from: `የቦሌ መድሃኒአለም ፈለገ ዮርዳኖስ ሰንበት ት/ቤት <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Ticket Confirmation 🎫",
      html: `
        <img src="https://i.ibb.co/0pk1rGP6/home.webp" alt="home" border="0" width="300px">
        <h2>ሰላም ${userName},</h2>
        <p>ክፍያዎ ተቀባይነት <strong>አግኝቷል!</strong>! 🎉</p>
        <p>የቲኬቶችዎ ቁጥሮች:</p>
        <ul>${ticketListHtml}</ul>
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
