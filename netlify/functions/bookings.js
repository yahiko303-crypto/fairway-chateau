const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyuqzkCcbNv5KzJaE2wQIXSLLpG2YT9esWw1O1vQbgGE1NiJF-q9n3VofcI_C4fbFbM/exec'; // from Step 1

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod === 'GET') {
    // Fetch bookings from Google Sheet
    const res = await fetch(GOOGLE_SHEET_URL);
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  }

  if (event.httpMethod === 'POST') {
    const booking = JSON.parse(event.body);

    // Send booking to Google Sheet
    const res = await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });

    const result = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Booking saved!', result })
    };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
