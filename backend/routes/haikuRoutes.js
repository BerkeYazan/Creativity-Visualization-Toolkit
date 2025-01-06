// backend/routes/haikuRoutes.js
const express = require('express');
const router = express.Router();
const csv = require('csv-parser');
const fs = require('fs');

router.get('/api/haikus', (req, res) => {
  const results = [];
  
  fs.createReadStream('haikus.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results);
    });
});

module.exports = router;