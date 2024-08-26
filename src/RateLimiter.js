class RateLimiter {
    constructor(maxRequests, interval) {
        this.maxRequests = maxRequests;
        this.interval = interval;
        this.requests = [];
    }

    allow() {
        const now = Date.now();
        this.requests = this.requests.filter(timestamp => now - timestamp < this.interval);

        if (this.requests.length >= this.maxRequests) {
            return false;
        }

        this.requests.push(now);
        return true;
    }
}

module.exports = RateLimiter;
