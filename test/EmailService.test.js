const assert = require('assert');
const EmailService = require('../src/EmailService');

describe('EmailService', () => {
    it('should send an email successfully', async () => {
        const emailService = new EmailService();
        await emailService.sendEmail('email_1', { subject: 'Test', body: 'This is a test email.' });
        assert.strictEqual(emailService.statusTracker['email_1'].success, true);
    });

    it('should handle retries and fallback to another provider', async () => {
        const emailService = new EmailService();
        await emailService.sendEmail('email_2', { subject: 'Test', body: 'This is another test email.' });
        assert.strictEqual(emailService.statusTracker['email_2'].success, true);
        assert.ok(emailService.statusTracker['email_2'].attempts > 1);
    });
});
