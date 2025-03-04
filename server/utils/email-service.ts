import nodemailer from "nodemailer";

export default async function sendEmailNotification(
  email: string,
  userName: string,
  ticketNumbers?: string[],
  isConfirmation?: boolean
) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    if (ticketNumbers && isConfirmation) {
      // const ticketListHtml = ticketNumbers
      //   .map((ticket) => `<li><strong>${ticket}</strong></li>`)
      //   .join("");

      await transporter.sendMail({
        from: `የቦሌ መድሃኒአለም ፈለገ ዮርዳኖስ ሰንበት ት/ቤት <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Ticket Confirmation 🎫",
        html: `
        <img src="https://res.cloudinary.com/digswjgpt/image/upload/v1741005286/%E1%8C%89%E1%8B%9E-01_1_a29hhn.jpg" alt="home" border="0" width="300px">
        <h2>ሰላም ${userName},</h2>
        <p>ክፍያዎ ተቀባይነት <strong>አግኝቷል!</strong>! 🎉</p>
        <p>የትኬት ቁጥርዎ: ${ticketNumbers[0]}</p>
        <p>ቲኬት ስለገዙ እናመሰግናለን። እርስዎን ለማየት በጉጉት እንጠባበቃለን!</p>
        <br/>
        <p>የቦሌ መድሃኒአለም ፈለገ ዮርዳኖስ ሰንበት ት/ቤት</p>
      `,
      });
    } else if (!isConfirmation) {
      await transporter.sendMail({
        from: `የቦሌ መድሃኒአለም ፈለገ ዮርዳኖስ ሰንበት ት/ቤት <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "የሞሉትን ቅጽ ተቀብለናል።",
        html: `
        <img src="https://res.cloudinary.com/digswjgpt/image/upload/v1741005286/%E1%8C%89%E1%8B%9E-01_1_a29hhn.jpg" alt="home" border="0" width="300px">
        <h2>ሰላም ${userName},</h2>
        <p>የቲኬት ክፍያዎን ስላስገቡ እናመሰግናለን።</p>
        <p>ክፍያዎ ሲረጋገጥ የቲኬት ቁጥር እንልክልዎታለን። እስከዚያው ድረስ ማንኛቸውም ጥያቄዎች ካሉዎት ለማነጋገር ነፃነት ይሰማዎ።</p>
        <br/>
        <p>የቦሌ መድሃኒአለም ፈለገ ዮርዳኖስ ሰንበት ት/ቤት</p>
      `,
      });
    }
    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}
