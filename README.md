# Psychology of Aesthetics Lab Experiment

This web-based experiment investigates the "inward bias" in visual composition preferences, based on Palmer and Langlois (2017)'s research on implied motion and facing direction preferences.

## Setup Instructions

1. Clone this repository
2. Copy `config.example.js` to `config.js`:
   ```bash
   cp config.example.js config.js
   ```
3. Set up your Google Apps Script:
   - Create a new Google Apps Script project
   - Copy the Apps Script code from the documentation
   - Deploy it as a web app
   - Copy the deployment URL
4. Update `config.js` with your Google Apps Script Web App URL:
   ```javascript
   const config = {
       SCRIPT_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL'
   };
   ```

## Important Notes
- The `config.js` file contains sensitive information and is ignored by Git
- Always use `config.example.js` as a template for new deployments
- Never commit `config.js` to version control

## Features
- Anonymous data collection
- Automatic data recording to Google Sheets
- Interactive visual preference testing
- Results visualization with Chart.js
- Downloadable results

## Technologies Used
- HTML/CSS/JavaScript
- Chart.js for data visualization
- Google Apps Script for data collection
- Google Sheets as a backend database 