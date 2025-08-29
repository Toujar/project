import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

export const sendRentReminderEmail = async (tenant, property, dueDate) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3B82F6;">Rent Payment Reminder</h2>
      <p>Dear ${tenant.name},</p>
      <p>This is a friendly reminder that your rent payment for <strong>${property.title}</strong> is due on <strong>${dueDate}</strong>.</p>
      <p><strong>Property Details:</strong></p>
      <ul>
        <li>Property: ${property.title}</li>
        <li>Location: ${property.location}</li>
        <li>Monthly Rent: $${property.rent}</li>
      </ul>
      <p>Please make your payment on time to avoid any late fees.</p>
      <p>Thank you!</p>
    </div>
  `;

  await sendEmail({
    to: tenant.email,
    subject: 'Rent Payment Reminder',
    html,
  });
};