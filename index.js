const EmailService = require('./src/EmailService');

const emailService = new EmailService();
emailService.sendEmail('unique-email-id', {
    subject: 'Hello World',
    body: 'This is a test email.'
});