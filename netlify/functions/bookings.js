// netlify/functions/bookings.js
exports.handler = async function(event, context) {
  if (event.httpMethod === 'GET') {
    // Return a sample bookings array for testing
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([
        {
          id: "bk_1",
          name: "John Doe",
          startISO: "2025-09-12T10:00:00.000Z",
          endISO: "2025-09-12T14:00:00.000Z"
        }
      ])
    };
  }

  if (event.httpMethod === 'POST') {
    const booking = JSON.parse(event.body);
    // Here you would save to Google Sheets or some database
    console.log("Received booking:", booking);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Booking received!" })
    };
  }

  return {
    statusCode: 405,
    body: "Method Not Allowed"
  };
};
