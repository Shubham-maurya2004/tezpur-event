import nodemailer from 'nodemailer';

const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Events Portal" <${process.env.SMTP_USER || 'noreply@tezu.ac.in'}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
