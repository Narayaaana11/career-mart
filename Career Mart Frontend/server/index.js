const express = require('express');
const bodyParser = require('body-parser');
const scrapeRoutes = require('./routes/scrape');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/scrape-jobs', scrapeRoutes);

app.get('/', (req, res) => {
  res.send('Job Scraper API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});