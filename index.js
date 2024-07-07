const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes

// Route to fetch bill data
app.get('/fetch-bill/:reference', async (req, res) => {
  const referenceNumber = req.params.reference;
  const url = `https://bill.pitc.com.pk/pescobill/general/${referenceNumber}`;

  try {
    const response = await axios.get(url);
    const htmlData = response.data;
    res.send(htmlData);
  } catch (error) {
    console.error('Error fetching bill data:', error);
    res.status(500).send('Error fetching bill data');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
