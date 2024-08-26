const EmailProviderA = require('./EmailProviderA');
const EmailProviderB = require('./EmailProviderB');
const RateLimiter = require('./RateLimiter');
const CircuitBreaker = require('./CircuitBreaker');

class EmailService {
    constructor() {
        this.providers = [new EmailProviderA(), new EmailProviderB()];
        this.currentProviderIndex = 0;
        this.rateLimiter = new RateLimiter(5, 10000); // max 5 emails per 10 seconds
        this.sentEmails = new Set(); // for idempotency
        this.statusTracker = {};
        this.circuitBreaker = new CircuitBreaker();
    }

    async sendEmail(emailId, emailData) {
        if (this.sentEmails.has(emailId)) {
            console.log('Duplicate email detected, skipping.');
            return;
        }

        this.sentEmails.add(emailId);
        this.statusTracker[emailId] = { attempts: 0, success: false };

        const maxRetries = 3;
        const delay = (retry) => new Promise(res => setTimeout(res, Math.pow(2, retry) * 1000)); // Exponential backoff

        while (this.statusTracker[emailId].attempts < maxRetries && !this.statusTracker[emailId].success) {
            try {
                if (!this.rateLimiter.allow()) {
                    throw new Error('Rate limit exceeded');
                }

                const provider = this.providers[this.currentProviderIndex];
                if (this.circuitBreaker.isOpen(provider)) {
                    this.switchProvider();
                    continue;
                }

                await provider.send(emailData);
                this.statusTracker[emailId].success = true;
                console.log(`Email sent successfully by ${provider.name}`);
            } catch (error) {
                this.statusTracker[emailId].attempts += 1;
                console.log(`Attempt ${this.statusTracker[emailId].attempts} failed: ${error.message}`);

                if (this.statusTracker[emailId].attempts >= maxRetries) {
                    console.log('Max retries reached. Switching provider.');
                    this.switchProvider();
                }

                if (error.message.includes('Rate limit exceeded')) {
                    await delay(this.statusTracker[emailId].attempts);
                }

                this.circuitBreaker.recordFailure(this.providers[this.currentProviderIndex]);
            }
        }

        if (!this.statusTracker[emailId].success) {
            console.log('All providers failed. Email sending aborted.');
        }
    }

    switchProvider() {
        this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length;
    }
}

module.exports = EmailService;
