const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const indexRouter = require('./routes');
const app = express();
const YAML = require('yaml');
const fs = require('fs');

const file = fs.readFileSync('./openapi.yaml', 'utf-8');
const swaggerDocument = YAML.parse(file);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());

app.use('/api/v1', indexRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: 'Not Found',
    data: null,
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    status: false,
    message: 'Internal Server error',
    err: err.message,
    data: null,
  });
});

module.exports = app;
