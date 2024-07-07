const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory

// Route to fetch bill data
app.get('/', async (req, res) => {
  const url = `https://bill.pitc.com.pk/pescobill/general/1260120216`;
    const response = await axios.get(url);
    const htmlData = response.data;
    console.log(htmlData);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
