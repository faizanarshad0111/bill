const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio'); // For parsing HTML
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(cors()); // Enable CORS for all route
app.use(express.static(path.join(__dirname)));

// Route to fetch bill data
app.get('/', (req, res) => {
  const referenceNumber = req.params.reference;
  const url = `https://bill.pitc.com.pk/pescobill/general/1260120216`;

  try {
    const response = await axios.get(url);
    const htmlData = response.data;
    console.log(htmlData);
  }catach(err){
    console.log(err)
  }
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
