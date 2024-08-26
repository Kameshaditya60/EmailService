class CircuitBreaker {
    constructor(failureThreshold = 3, recoveryTime = 30000) {
        this.failureThreshold = failureThreshold;
        this.recoveryTime = recoveryTime;
        this.failures = new Map();
    }

    recordFailure(provider) {
        const failures = this.failures.get(provider.name) || { count: 0, lastFailure: Date.now() };
        failures.count += 1;
        failures.lastFailure = Date.now();
        this.failures.set(provider.name, failures);

        if (failures.count >= this.failureThreshold) {
            console.log(`${provider.name} circuit breaker tripped.`);
        }
    }

    isOpen(provider) {
        const failures = this.failures.get(provider.name);
        if (!failures) return false;

        if (failures.count >= this.failureThreshold) {
            const timeSinceLastFailure = Date.now() - failures.lastFailure;
            if (timeSinceLastFailure > this.recoveryTime) {
                console.log(`${provider.name} circuit breaker reset.`);
                this.failures.delete(provider.name);
                return false;
            }
            return true;
        }

        return false;
    }
}

module.exports = CircuitBreaker;
