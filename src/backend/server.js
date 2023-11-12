const express = require('express');
const fs = require('fs')
const { II, DD, EE } = require('./logging');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const { processArgs } = require('./process-args');
const syncWithMaster = require('./google-sheet-sync');

const ARGS = processArgs(argv)

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, ARGS.staticPath)));

// Set up MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'eurotourno_user',
  password: 'Where we all bel0ng!',
  database: 'EuroTourno'
});
const { select } = require('./db-helper')(db)

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the MySQL server.');
});

// API endpoint to get data from the database
app.get('/api/pitches', async (req, res) => {
  const query = 'SELECT * FROM v_pitch_events';
  try {
    const data = await select(query)
    return res.json(data)
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
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

app.get('/api/fixtures/:id/start', (req, res) => {
  II('Start fixture 1')
  II('Start fixture', req.params)
  const { id } = req.params
  const mysqlTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const query = [
    "UPDATE fixtures",
    `SET started = '${mysqlTimestamp}'`,
    `WHERE id = ${id};`,
  ].join(' ')

  db.query(query, (err, results) => {
    if (err) {
      console.log('Error occured', err)
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: results });
  });
});

app.post('/api/fixtures/:id/score', (req, res) => {
  const { id } = req.params
  const { team1, team2 } = req.body
  const query = [
    "UPDATE fixtures",
    `SET goals1 = '${team1.goals}', points1 = '${team2.points}', `,
    `    goals2 = '${team2.goals}', points2 = '${team2.points}'`,
    `WHERE id = ${id};`,
  ].join(' ')
  db.query(query, (err, results) => {
    if (err) {
      console.log('Error occured', err)
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: results });
  });
});


app.get('/sync', async (req, res) => {
  await syncWithMaster(db)
  res.json({
    message: 'data synced. Please close window'
  })
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
  res.sendFile(path.join(__dirname, '../../src/frontend/interfaces/pitch/watch/index.html'));
});

app.listen(ARGS.port, () => {
  console.log(`server running on port ${port}`);
});
