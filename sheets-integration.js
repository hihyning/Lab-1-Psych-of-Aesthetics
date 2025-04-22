// Google Sheets Integration
// Import configuration from global scope
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwcqAi9Y2vKSaJTzpM2DKv58kE2COL2TI7aOjGFZlqSKn705Xmuz5kVwGjOLZryjSsJlw/exec';

// Append data to the spreadsheet
async function appendToSheet(data) {
    try {
        console.log('Starting appendToSheet function...');
        console.log('Using Script URL:', SCRIPT_URL);

        if (!data || !data.summary) {
            throw new Error('Invalid data format');
        }

        const payload = {
            total: data.summary.total || 0,
            inwardCount: data.summary.inwardCount || 0,
            outwardCount: data.summary.outwardCount || 0,
            inwardPercentage: data.summary.inwardPercentage || 0,
            outwardPercentage: data.summary.outwardPercentage || 0,
            averageReactionTime: data.summary.averageReactionTime || 0,
            totalDuration: data.totalDuration || '0',
            timestamp: new Date().toISOString() // Add timestamp
        };

        console.log('Sending data to spreadsheet:', payload);

        try {
            // First try POST request
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // This is required for cross-origin requests
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            console.log('POST Response:', response);
            
            // With no-cors, we won't get much response info
            // So we'll consider it a success if we get here without an error
            console.log('Data likely sent successfully (no-cors mode prevents detailed response info)');
            return true;

        } catch (fetchError) {
            console.error('POST request failed:', fetchError);
            
            // Fallback to GET request with parameters
            console.log('Trying GET fallback...');
            
            const urlWithParams = new URL(SCRIPT_URL);
            Object.keys(payload).forEach(key => {
                urlWithParams.searchParams.append(key, payload[key]);
            });

            try {
                const getResponse = await fetch(urlWithParams.toString(), {
                    method: 'GET',
                    mode: 'no-cors'
                });
                console.log('GET fallback response:', getResponse);
                return true;
            } catch (getError) {
                console.error('GET fallback failed:', getError);
                throw getError;
            }
        }
    } catch (error) {
        console.error('Error in appendToSheet:', error);
        // Log the full error details
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return false;
    }
}
