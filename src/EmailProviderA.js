class EmailProviderA {
    constructor() {
        this.name = 'ProviderA';
    }

    async send(emailData) {
        // Simulate sending email (replace this with actual provider API call)
        console.log(`${this.name} is sending email...`);
        if (Math.random() > 0.7) throw new Error(`${this.name} failed to send email`);
    }
}

module.exports = EmailProviderA;
