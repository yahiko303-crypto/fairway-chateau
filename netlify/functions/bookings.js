// bookings.js for Netlify functions using Google Sheets

const { google } = require('googleapis');

// Constants
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.SPREADSHEET_ID; // Add this env variable in Netlify
const SHEET_NAME = process.env.SHEET_NAME || 'Sheet1'; // Optional env variable, default to Sheet1

// JWT authentication using environment variables
const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  SCOPES
);

const sheets = google.sheets({ version: 'v4', auth });

exports.handler = async function(event, context) {
  if (event.httpMethod === 'GET') {
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:H`,
      });

      const rows = res.data.values || [];
      const data = rows.map((r, i) => ({
        id: r[0] || `bk_${i}`,
        name: r[1],
        email: r[2],
        phone: r[3],
        location: r[4],
        indoorOutdoor: r[5],
        startISO: r[6],
        endISO: r[7],
        title: r[1] || 'Booking',
      }));

      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } catch (err) {
      console.error('Error reading sheet:', err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to fetch bookings' }),
      };
    }
  }

  if (event.httpMethod === 'POST') {
    const booking = JSON.parse(event.body);

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:H`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [
            [
              booking.id,
              booking.name,
              booking.email,
              booking.phone,
              booking.location,
              booking.indoorOutdoor,
              booking.startISO,
              booking.endISO,
            ],
          ],
        },
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Booking saved!' }),
      };
    } catch (err) {
      console.error('Error appending to sheet:', err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to save booking' }),
      };
    }
  }

  return {
    statusCode: 405,
    body: 'Method Not Allowed',
  };
};
