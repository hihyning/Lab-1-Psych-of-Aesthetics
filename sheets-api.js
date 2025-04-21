// Configuration
console.log ("hello")
const SPREADSHEET_ID = '1hufTDMGb2zD1uSGnZZQVranXy0WNSUv2CbyJUorSvbg';
const CLIENT_ID = '129125842923-511jr42ljd93n4jasag44trhaah5f3e3.apps.googleusercontent.com';
const API_KEY = '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';
let participantCounter = 0;

// Initialize the API
function initializeGoogleSheetsAPI() {
    gapi.load('client:auth2', async () => {
        try {
            await gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                scope: 'https://www.googleapis.com/auth/spreadsheets',
            });
            
            await gapi.client.load('sheets', 'v4');
            console.log('Google Sheets API initialized');
        } catch (error) {
            console.error('Error initializing Google Sheets API:', error);
        }
    });
}

// Call initialization when page loads
document.addEventListener('DOMContentLoaded', initializeGoogleSheetsAPI);
// Function to append data to sheet
async function appendToSheet(data) {
  try {
    const participantId = String(participantCounter + 1).padStart(3, '0'); // Creates IDs like 001, 002, etc.
    
    // Format data for sheet
    const rowData = [
      new Date().toISOString(),           // Timestamp
      participantId,                      // Participant ID
      data.summary.inwardPercentage,      // Inward Choice %
      data.summary.averageReactionTime,   // Avg Reaction Time
      data.totalDuration,                 // Total Duration
      JSON.stringify(data.detailedResults) // Trial Details
    ];

    // Make API request
    await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:F',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [rowData]
      }
    });

    participantCounter++;
    console.log('Data successfully appended');
  } catch (error) {
    console.error('Error appending data:', error);
  }
}