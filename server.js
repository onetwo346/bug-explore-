const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/bugs', (req, res) => {
  fs.readFile(path.join(__dirname, 'bugs.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to load bugs' });
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
