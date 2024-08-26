# Email Service

## Overview

This project implements a resilient email sending service in JavaScript. It supports retry logic with exponential backoff, provider fallback, idempotency, rate limiting, and status tracking.

## Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/email-service.git
    ```
2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the tests:
    ```bash
    npm test
    ```

## Usage

To use the `EmailService`, instantiate it and call the `sendEmail` method:

```javascript
const EmailService = require('./src/EmailService');

const emailService = new EmailService();
emailService.sendEmail('unique-email-id', {
    subject: 'Hello World',
    body: 'This is a test email.'
});
