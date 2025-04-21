// Configuration settings
window.config = {
    // Google Apps Script Web App URL for data collection
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwcqAi9Y2vKSaJTzpM2DKv58kE2COL2TI7aOjGFZlqSKn705Xmuz5kVwGjOLZryjSsJlw/exec'
};

// Export the configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} 