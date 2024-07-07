const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Route to fetch bill data
app.get('/fetch-bill/:reference', async (req, res) => {
  const referenceNumber = req.params.reference;
  const url = `https://bill.pitc.com.pk/pescobill/general/${referenceNumber}`;

  try {
    const response = await axios.get(url);
    const htmlData = response.data;

    // Parse HTML using Cheerio
    const $ = cheerio.load(htmlData);

    // Example: Extracting specific data, adjust as per your needs
    const billAmount = $('div.col-6.col-lg-4').eq(1).text().trim();
    const billDetails = $('div.bill-details').html(); // Using .html() to get inner HTML

    // Construct the HTML to send back
    const formattedHtml = `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bill Details</title>
        <style>
          /* CSS styles matching the target page */
          body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border: 1px solid #ddd;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .bill-header {
            background-color: #f8f9fa;
            padding: 15px 20px;
            text-align: center;
            margin-bottom: 20px;
            border: 1px solid #e9ecef;
          }
          .bill-header h1 {
            color: #007bff;
            font-size: 1.8em;
            font-weight: bold;
            margin: 0;
          }
          .bill-details {
            background-color: #fff;
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid #e9ecef;
          }
          .bill-details h2 {
            font-size: 1.4em;
            color: #007bff;
            margin-bottom: 15px;
          }
          .bill-details p {
            font-size: 1.1em;
            color: #555;
            margin-bottom: 10px;
          }
          .bill-amount {
            font-size: 1.5em;
            font-weight: bold;
            color: #007bff;
          }
          .bill-table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
            border: 1px solid #ddd;
          }
          .bill-table th, .bill-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          .bill-table th {
            background-color: #f8f9fa;
            color: #333;
          }
          .bill-table td {
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="bill-header">
            <h1>Bill Details</h1>
          </div>
          <div class="bill-details">
            <h2>Bill Information</h2>
            <p>${billDetails}</p>
            <p>Bill Amount: <span class="bill-amount">${billAmount}</span></p>
            <!-- Add more elements as needed -->
          </div>
          <!-- Insert more sections based on parsed data -->
        </div>
      </body>
      </html>
    `;

    res.send(formattedHtml); // Send the formatted HTML to the client
  } catch (error) {
    console.error('Error fetching bill data:', error);
    res.status(500).send('Error fetching bill data');
  }
});

// Serve the HTML form
app.get('/', (req, res) => {
  res.send(`
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Fetch PESCO Bill</title>
    </head>
    <body>
      <h1>Fetch PESCO Bill</h1>
      <form id="bill-form">
        <label for="reference">Reference Number:</label>
        <input type="text" id="reference" name="reference" required>
        <button type="submit">Fetch Bill</button>
      </form>
      <div id="bill-content"></div>

      <script>
        document.getElementById('bill-form').addEventListener('submit', async function(e) {
          e.preventDefault();
          const reference = document.getElementById('reference').value;
          const response = await fetch(\`/fetch-bill/\${reference}\`);
          const htmlData = await response.text();
          document.getElementById('bill-content').innerHTML = htmlData;
        });
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
