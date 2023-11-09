const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const syncWithMaster = require('./google-sheet-sync');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../src/apps/pitch/watch')));

// Set up MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'eurotourno_user',
  password: 'Where we all bel0ng!',
  database: 'EuroTourno'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the MySQL server.');
});

// API endpoint to get data from the database
app.get('/api/pitches', (req, res) => {
  const query = 'SELECT * FROM pitches';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: results });
  });
});

app.get('/api/fixtures/:parameter', (req, res) => {
  const parameter = req.params.parameter;
  
  // Now you can use the 'parameter' variable to fetch specific data from your database
  const query = `SELECT * FROM v_fixture_information WHERE pitch = '${parameter}'`;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: results });
  });
});


app.get('/sync', async (req, res) => {
  await syncWithMaster(db)
});

// API endpoint to post data to the database
app.post('/api/data', (req, res) => {
  const data = req.body;
  const query = 'INSERT INTO your_table_name SET ?';
  db.query(query, data, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ result: results });
  });
});

// Catchall handler to serve the React index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../src/apps/pitch/watch/index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
