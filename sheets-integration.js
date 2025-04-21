// Google Sheets Integration
// Import configuration
const SCRIPT_URL = config.SCRIPT_URL;

// Append data to the spreadsheet
async function appendToSheet(data) {
    try {
        console.log('Starting appendToSheet function...');

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
            totalDuration: data.totalDuration || '0'
        };

        console.log('Sending data to spreadsheet:', payload);

        // Create URL with parameters as a fallback
        const urlWithParams = new URL(SCRIPT_URL);
        Object.keys(payload).forEach(key => {
            urlWithParams.searchParams.append(key, payload[key]);
        });

        try {
            // First try POST request
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(payload)
            });

            // Log the response details
            console.log('Response received:', {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText
            });

            if (!response.ok && response.status !== 0) { // status 0 is normal with no-cors
                // If POST fails, try GET as fallback
                console.log('POST failed, trying GET...');
                const getResponse = await fetch(urlWithParams.toString(), {
                    method: 'GET',
                    mode: 'no-cors'
                });
                console.log('GET response:', getResponse);
            }

            console.log('Data sent successfully');
            return true;
        } catch (fetchError) {
            console.error('Fetch error:', fetchError);
            // Try one last time with GET
            try {
                const lastResponse = await fetch(urlWithParams.toString(), {
                    method: 'GET',
                    mode: 'no-cors'
                });
                console.log('Final attempt response:', lastResponse);
                return true;
            } catch (finalError) {
                console.error('Final attempt failed:', finalError);
                throw finalError;
            }
        }
    } catch (error) {
        console.error('Error sending data:', error);
        // Don't alert the user about backend errors, just log them
        console.warn('Failed to save to spreadsheet, but continuing with local download');
        return false;
    }
}
