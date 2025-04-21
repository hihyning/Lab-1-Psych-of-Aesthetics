// Configuration settings
const config = {
    // Replace with your Google Apps Script Web App URL after deployment
    SCRIPT_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL',
    // These are no longer needed with the new Apps Script approach, but kept for reference
    CLIENT_ID: 'YOUR_CLIENT_ID',
    API_KEY: 'YOUR_API_KEY'
};

// Export the configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} 