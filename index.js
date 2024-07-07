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
    const billHtml = response.data;
    res.send(billHtml); // Send the fetched HTML to the client
  } catch (error) {
    res.status(500).send('Error fetching bill data');
  }
});

// Serve the HTML form
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
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
