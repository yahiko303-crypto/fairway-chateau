// netlify/functions/bookings.js
import fetch from 'node-fetch';

export async function handler(event, context) {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbyuqzkCcbNv5KzJaE2wQIXSLLpG2YT9esWw1O1vQbgGE1NiJF-q9n3VofcI_C4fbFbM/exec');
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // allows your front-end to fetch
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
