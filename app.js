const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (request, response) => {
  response.send('It Works!');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

